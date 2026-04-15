import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {

  
  apiKey: "AIzaSyA_KOBxwroEc6qbSbfIrb-kfTeQm2812Ik",
    authDomain: "resellers-90507.firebaseapp.com",
    projectId: "resellers-90507",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  try {
    console.log("⏳ Seeding database...");

    // 👤 USERS
    await setDoc(doc(db, "users", "admin1"), {
      uid: "admin1",
      name: "Admin User",
      email: "admin@test.com",
      role: "admin",
      createdAt: serverTimestamp()
    });

    // 🚗 VEHICLES
    await addDoc(collection(db, "vehicles"), {
      title: "Toyota Hilux 2020",
      brand: "Toyota",
      make: "Toyota",
      model: "Hilux",
      year: 2020,
      mileage: 45000,
      price: 25000,
      images: [],
      condition: "Used",
      status: "Available",
      createdAt: serverTimestamp()
    });

    // 📦 EXPORT REQUEST
    const requestRef = await addDoc(collection(db, "export_requests"), {
      user_id: "admin1",
      destination: "Kenya",
      budget: 30000,
      preferences: "Low mileage",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    // 💬 MESSAGE (linked to request)
    await addDoc(collection(db, "messages"), {
      request_id: requestRef.id,
      user_id: "admin1",
      user_name: "Admin User",
      user_role: "admin",
      content: "We’ve started sourcing your vehicle.",
      createdAt: serverTimestamp()
    });

    // 📩 INQUIRY
    await addDoc(collection(db, "inquiries"), {
      type: "General",
      name: "Test Client",
      email: "client@test.com",
      message: "Looking for a Toyota",
      status: "New",
      createdAt: serverTimestamp()
    });

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedDatabase();