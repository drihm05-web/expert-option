import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
let db: any = null;

async function connectDB() {
  if (!uri) {
    console.error('MONGODB_URI environment variable is missing. Please add it to your secrets.');
    return;
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('exertion');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectDB();

// --- API ROUTES ---

// Users
app.get('/api/users/:id', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  try {
    const user = await db.collection('users').findOne({ id: req.params.id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  try {
    const { id, email, name, role, createdAt } = req.body;
    const existingUser = await db.collection('users').findOne({ id });
    
    if (existingUser) {
      res.json(existingUser);
    } else {
      const newUser = { id, email, name, role: role || 'client', createdAt: createdAt || new Date().toISOString() };
      await db.collection('users').insertOne(newUser);
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  try {
    const vehicles = await db.collection('vehicles').find({}).toArray();
    res.json(vehicles.map((v: any) => ({ ...v, id: v._id.toString() })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// --- VITE MIDDLEWARE ---
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  import("vite").then(async (vite) => {
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteServer.middlewares);
  });
} else if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
