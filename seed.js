import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const app = initializeApp({
    apiKey: "AIzaSyA_KOBxwroEc6qbSbfIrb-kfTeQm2812Ik",
    authDomain: "resellers-90507.firebaseapp.com",
    projectId: "resellers-90507"
  });

  const db = getFirestore(app);

  await addDoc(collection(db, "vehicles"), {
    title: "Seed Vehicle",
    price: 10000
  });

  res.status(200).json({ message: "Seeded" });
}