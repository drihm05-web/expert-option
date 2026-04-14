import express from 'express';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = process.env.JWT_SECRET || 'exertion-exports-super-secret-key-2024';

// Initialize SQLite Database
const db = new Database('database.sqlite');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'client',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    title TEXT,
    brand TEXT,
    make TEXT,
    model TEXT,
    year INTEGER,
    price REAL DEFAULT 0,
    mileage REAL DEFAULT 0,
    condition TEXT DEFAULT 'Used',
    status TEXT DEFAULT 'Available',
    image_url TEXT,
    images TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS export_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    vehicle_id TEXT REFERENCES vehicles(id),
    destination TEXT NOT NULL,
    budget REAL,
    preferences TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES export_requests(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert default settings if not exists
  INSERT OR IGNORE INTO settings (key, value) 
  VALUES ('eft_details', '{"bank": "Standard Bank", "accountName": "Exertion Exports", "accountNumber": "123456789", "branchCode": "051001"}');
`);

// Helper to generate UUIDs
const uuid = () => crypto.randomUUID();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // Auth Routes
  app.post('/api/auth/signup', (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 10);
      const id = uuid();
      // First user becomes admin
      const count = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
      const role = count.count === 0 ? 'admin' : 'client';
      
      db.prepare('INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)').run(id, email, hash, name || email.split('@')[0], role);
      
      const token = jwt.sign({ id, email, role }, JWT_SECRET);
      res.json({ token, user: { id, email, name, role } });
    } catch (err: any) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(req.user.id);
    res.json({ user });
  });

  // Vehicles
  app.get('/api/vehicles', (req, res) => {
    const vehicles = db.prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
    res.json(vehicles.map((v: any) => ({ ...v, images: v.images ? JSON.parse(v.images) : [] })));
  });

  app.post('/api/vehicles', authenticate, requireAdmin, (req, res) => {
    const { title, brand, make, model, year, mileage, price, condition, status, images } = req.body;
    const id = uuid();
    db.prepare('INSERT INTO vehicles (id, title, brand, make, model, year, mileage, price, condition, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, title, brand, make, model, year, mileage, price, condition, status, JSON.stringify(images || []));
    res.json({ id });
  });

  app.delete('/api/vehicles/:id', authenticate, requireAdmin, (req, res) => {
    db.prepare('DELETE FROM vehicles WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Export Requests
  app.get('/api/requests', authenticate, (req: any, res) => {
    let requests;
    if (req.user.role === 'admin') {
      requests = db.prepare('SELECT * FROM export_requests ORDER BY created_at DESC').all();
    } else {
      requests = db.prepare('SELECT * FROM export_requests WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    }
    res.json(requests);
  });

  app.post('/api/requests', authenticate, (req: any, res) => {
    const { vehicle_id, destination, budget, preferences } = req.body;
    const id = uuid();
    db.prepare('INSERT INTO export_requests (id, user_id, vehicle_id, destination, budget, preferences) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, req.user.id, vehicle_id, destination, budget, preferences);
    res.json({ id });
  });

  app.patch('/api/requests/:id', authenticate, requireAdmin, (req, res) => {
    db.prepare('UPDATE export_requests SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
    res.json({ success: true });
  });

  // Inquiries
  app.get('/api/inquiries', authenticate, requireAdmin, (req, res) => {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    res.json(inquiries);
  });

  app.post('/api/inquiries', (req, res) => {
    const { type, name, email, message } = req.body;
    const id = uuid();
    db.prepare('INSERT INTO inquiries (id, type, name, email, message) VALUES (?, ?, ?, ?, ?)')
      .run(id, type, name, email, message);
    res.json({ id });
  });

  // Users
  app.get('/api/users', authenticate, requireAdmin, (req, res) => {
    const users = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  });

  app.patch('/api/users/:id', authenticate, requireAdmin, (req, res) => {
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(req.body.role, req.params.id);
    res.json({ success: true });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const result: any = {};
    settings.forEach((s: any) => result[s.key] = JSON.parse(s.value));
    res.json(result);
  });

  app.post('/api/settings', authenticate, requireAdmin, (req, res) => {
    const { key, value } = req.body;
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .run(key, JSON.stringify(value));
    res.json({ success: true });
  });

  // Messages
  app.get('/api/messages/:requestId', authenticate, (req: any, res) => {
    const messages = db.prepare('SELECT * FROM messages WHERE request_id = ? ORDER BY created_at ASC').all(req.params.requestId);
    res.json(messages);
  });

  app.post('/api/messages', authenticate, (req: any, res) => {
    const { request_id, content } = req.body;
    const id = uuid();
    db.prepare('INSERT INTO messages (id, request_id, user_id, content) VALUES (?, ?, ?, ?)')
      .run(id, request_id, req.user.id, content);
    
    const newMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    
    // Broadcast via WS
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'NEW_MESSAGE', payload: newMessage }));
      }
    });
    
    res.json(newMessage);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // --- WEBSOCKET SERVER ---
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.on('close', () => console.log('Client disconnected'));
  });
}

startServer();
