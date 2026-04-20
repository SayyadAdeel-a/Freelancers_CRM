import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "./config";

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  createdAt: any;
  lastContacted?: any;
  plan?: string;
}

export async function getClients(userId: string) {
  const q = query(
    collection(db, "clients"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Client[];
}

export async function addClient(userId: string, clientData: Omit<Client, "id" | "userId" | "createdAt">) {
  return await addDoc(collection(db, "clients"), {
    userId,
    ...clientData,
    createdAt: serverTimestamp(),
  });
}

export async function updateClient(clientId: string, data: Partial<Client>) {
  const clientRef = doc(db, "clients", clientId);
  return await updateDoc(clientRef, data);
}

export async function deleteClient(clientId: string) {
  return await deleteDoc(doc(db, "clients", clientId));
}