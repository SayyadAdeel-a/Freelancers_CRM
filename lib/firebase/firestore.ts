import {
  collection,
  query,
  where,
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

export interface Note {
  id: string;
  clientId: string;
  content: string;
  createdAt: any;
}

export { query, collection, where, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, serverTimestamp };
export { getDocs as getDocsFn };
export async function getDocs(collectionRef: any) {
  const q = query(collectionRef);
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
export async function getClients(userId: string) {
  const q = query(
    collection(db, "clients"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocsFn(q);
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

export async function getClient(clientId: string) {
  const q = query(collection(db, "clients"), where("__name__", "==", clientId));
  const querySnapshot = await getDocsFn(q);
  if (querySnapshot.empty) return null;
  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Client;
}

export async function getNotes(clientId: string) {
  const q = query(
    collection(db, "notes"),
    where("clientId", "==", clientId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Note[];
}

export async function addNote(clientId: string, content: string) {
  return await addDoc(collection(db, "notes"), {
    clientId,
    content,
    createdAt: serverTimestamp(),
  });
}
export async function getNotesByClient(clientId: string) {
  return await getNotes(clientId);
}
export async function addReminder(clientId: string, userId: string, remindAt: Date, message: string) {
  return await addDoc(collection(db, "reminders"), {
    clientId,
    userId,
    remindAt,
    message,
    isSent: false,
    createdAt: serverTimestamp(),
  });
}
export async function createClient(userId: string, clientData: Omit<Client, "id" | "userId" | "createdAt">) {
  return await addDoc(collection(db, "clients"), {
    userId,
    ...clientData,
    createdAt: serverTimestamp(),
  });
}
export async function createNote(clientId: string, userId: string, content: string) {
  return await addDoc(collection(db, "notes"), {
    clientId,
    userId,
    content,
    createdAt: serverTimestamp(),
  });
}
