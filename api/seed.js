import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA_KOBxwroEc6qbSbfIrb-kfTeQm2812Ik",
    authDomain: "resellers-90507.firebaseapp.com",
    projectId: "resellers-90507",
    storageBucket: "resellers-90507.firebasestorage.app",
    messagingSenderId: "407063416894",
    appId: "1:407063416894:web:06855b7af6337b8dc3c16f",
    measurementId: "G-3T6MMDJBRW"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  try {
    // 1. Seed User (Admin)
    const adminRef = await addDoc(collection(db, "users"), {
      uid: "admin-seed-user", 
      name: "Admin User",
      email: "admin@exertionexports.com",
      role: "admin",
      createdAt: serverTimestamp()
    });

    // 2. Seed Vehicle
    const vehicleRef = await addDoc(collection(db, "vehicles"), {
      title: "2022 Toyota Hilux Legend RS",
      brand: "Toyota",
      make: "Toyota",
      model: "Hilux",
      year: 2022,
      mileage: 15000,
      price: 48000,
      images: ["https://placehold.co/600x400?text=Hilux+Legend"],
      condition: "Used",
      status: "Available",
      createdAt: serverTimestamp()
    });

    // 3. Seed Export Request
    const requestRef = await addDoc(collection(db, "export_requests"), {
      user_id: adminRef.id,
      vehicle_id: vehicleRef.id,
      destination: "Zimbabwe",
      budget: 50000,
      preferences: "Needs protective coating for off-road use.",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    // 4. Seed Message
    await addDoc(collection(db, "messages"), {
      request_id: requestRef.id,
      user_id: adminRef.id,
      user_name: "Admin User",
      user_role: "admin",
      content: "Welcome to Exertion Exports. We are reviewing your request.",
      createdAt: serverTimestamp()
    });

    // 5. Seed Inquiry
    await addDoc(collection(db, "inquiries"), {
      type: "Sourcing",
      name: "John Doe",
      email: "john@example.com",
      message: "Looking for a fleet of 5 Land Cruisers.",
      status: "New",
      createdAt: serverTimestamp()
    });

    // 6. Seed Setting
    await setDoc(doc(db, "settings", "site_config"), {
      value: "Enabled"
    });

    return res.status(200).json({ 
      success: true, 
      message: "Resellers-90507 Database Seeded!" 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
