import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = typeof process.env.PORT === 'string' ? parseInt(process.env.PORT, 10) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

app.use(cors());
app.use(express.json());

// MongoDB Connection
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is missing. Current env keys:', Object.keys(process.env).join(', '));
    throw new Error('MONGODB_URI missing. If you just added it in Vercel, you need to trigger a Redeploy!');
  }
  
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      await cachedClient.connect();
    }
    cachedDb = cachedClient.db('exertion');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedClient = null; // Reset client on error
    throw error;
  }
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email === 'drihm05@gmail.com' || email === 'dominic@exertionexports.com';
    const role = isAdmin ? 'admin' : 'client';
    
    const newUser = {
      email,
      name,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    const userId = result.insertedId.toString();

    const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: userId, email, name, role } });
  } catch (error: any) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Failed to register', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userId = user.id || user._id.toString();
    const token = jwt.sign({ userId, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: userId, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const db = await connectDB();
    
    // Safely construct query to avoid ObjectId errors
    const query: any = { $or: [{ id: decoded.userId }] };
    if (/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
      query.$or.push({ _id: new ObjectId(decoded.userId) });
    }

    const user = await db.collection('users').findOne(query);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: { id: user.id || user._id.toString(), email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    console.error('Error in me:', error);
    res.status(401).json({ error: 'Invalid or expired token', details: error.message });
  }
});

// Users
app.get('/api/users/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ id: req.params.id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Error in GET /api/users/:id:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection('users').find({}).toArray();
    res.json(users.map((u: any) => ({ ...u, id: u.id || u._id.toString() })));
  } catch (error: any) {
    console.error('Error in GET /api/users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const db = await connectDB();
    const { id, email, name, role, createdAt } = req.body;
    
    const isAdmin = email === 'drihm05@gmail.com' || email === 'dominic@exertionexports.com';
    const assignedRole = isAdmin ? 'admin' : (role || 'client');

    const existingUser = await db.collection('users').findOne({ id });
    
    if (existingUser) {
      if (isAdmin && existingUser.role !== 'admin') {
        await db.collection('users').updateOne({ id }, { $set: { role: 'admin' } });
        existingUser.role = 'admin';
      }
      res.json(existingUser);
    } else {
      const newUser = { id, email, name, role: assignedRole, createdAt: createdAt || new Date().toISOString() };
      await db.collection('users').insertOne(newUser);
      res.status(201).json(newUser);
    }
  } catch (error: any) {
    console.error('Error in POST /api/users:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection('users').updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in PATCH /api/users/:id:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const db = await connectDB();
    const vehicles = await db.collection('vehicles').find({}).toArray();
    res.json(vehicles.map((v: any) => ({ ...v, id: v._id.toString() })));
  } catch (error: any) {
    console.error('Error in GET /api/vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles', details: error.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('vehicles').insertOne({ ...req.body, createdAt: new Date().toISOString() });
    res.status(201).json({ id: result.insertedId });
  } catch (error: any) {
    console.error('Error in POST /api/vehicles:', error);
    res.status(500).json({ error: 'Failed to create vehicle', details: error.message });
  }
});

app.patch('/api/vehicles/:id', async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection('vehicles').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in PATCH /api/vehicles/:id:', error);
    res.status(500).json({ error: 'Failed to update vehicle', details: error.message });
  }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection('vehicles').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/vehicles/:id:', error);
    res.status(500).json({ error: 'Failed to delete vehicle', details: error.message });
  }
});

// Export Requests
app.get('/api/export-requests', async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.query.userId as string;
    let query = {};
    if (userId) {
      query = { user_id: userId };
    }
    const requests = await db.collection('export_requests').find(query).toArray();
    res.json(requests.map((r: any) => ({ ...r, id: r._id.toString() })));
  } catch (error: any) {
    console.error('Error in GET /api/export-requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
  }
});

app.post('/api/export-requests', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('export_requests').insertOne({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: result.insertedId });
  } catch (error: any) {
    console.error('Error in POST /api/export-requests:', error);
    res.status(500).json({ error: 'Failed to create request', details: error.message });
  }
});

app.patch('/api/export-requests/:id', async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection('export_requests').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in PATCH /api/export-requests/:id:', error);
    res.status(500).json({ error: 'Failed to update request', details: error.message });
  }
});

// Inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    const db = await connectDB();
    const inquiries = await db.collection('inquiries').find({}).toArray();
    res.json(inquiries.map((i: any) => ({ ...i, id: i._id.toString() })));
  } catch (error: any) {
    console.error('Error in GET /api/inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries', details: error.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('inquiries').insertOne({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: result.insertedId });
  } catch (error: any) {
    console.error('Error in POST /api/inquiries:', error);
    res.status(500).json({ error: 'Failed to create inquiry', details: error.message });
  }
});

app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection('inquiries').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in PATCH /api/inquiries/:id:', error);
    res.status(500).json({ error: 'Failed to update inquiry', details: error.message });
  }
});

// Messages (Chat)
app.get('/api/messages', async (req, res) => {
  try {
    const db = await connectDB();
    const requestId = req.query.requestId as string;
    if (!requestId) return res.status(400).json({ error: 'requestId is required' });
    
    const messages = await db.collection('messages').find({ request_id: requestId }).toArray();
    res.json(messages.map((m: any) => ({ ...m, id: m._id.toString() })));
  } catch (error: any) {
    console.error('Error in GET /api/messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('messages').insertOne({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: result.insertedId });
  } catch (error: any) {
    console.error('Error in POST /api/messages:', error);
    res.status(500).json({ error: 'Failed to create message', details: error.message });
  }
});

// Settings
app.get('/api/settings', async (req, res) => {
  try {
    const db = await connectDB();
    const settings = await db.collection('settings').find({}).toArray();
    res.json(settings.map((s: any) => ({ ...s, id: s.id || s._id.toString() })));
  } catch (error: any) {
    console.error('Error in GET /api/settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const db = await connectDB();
    const { key, value } = req.body;
    await db.collection('settings').updateOne(
      { id: key },
      { $set: { id: key, value } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error in POST /api/settings:', error);
    res.status(500).json({ error: 'Failed to save settings', details: error.message });
  }
});

// --- VITE MIDDLEWARE ---
if (process.env.NODE_ENV !== "production") {
  import("vite").then(async (vite) => {
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteServer.middlewares);
  });
} else {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;
