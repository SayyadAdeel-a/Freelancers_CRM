import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  limit,
  getCountFromServer
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
  noteCount?: number;
  nextReminder?: Reminder | null;
}

export interface Reminder {
  id: string;
  clientId: string;
  userId: string;
  remindAt: any;
  message: string;
  isSent: boolean;
  createdAt: any;
}

export interface Note {
  id: string;
  clientId: string;
  content: string;
  createdAt: any;
}

export { query, collection, where, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs };
export const getDocsFn = getDocs;

export async function getDocsData(collectionRef: any) {
  const q = query(collectionRef);
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map(doc => ({ ...(doc.data() as object), id: doc.id }));
}
export async function getClients(userId: string) {
  const q = query(
    collection(db, "clients"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocsFn(q);
  const clients = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
    const clientData = docSnap.data();
    // Fetch note count
    const notesQ = query(collection(db, "notes"), where("clientId", "==", docSnap.id));
    const countSnapshot = await getCountFromServer(notesQ);
    
    // Fetch next reminder
    const remindersQ = query(
      collection(db, "reminders"), 
      where("clientId", "==", docSnap.id),
      where("isSent", "==", false),
      where("remindAt", ">=", new Date()),
      orderBy("remindAt", "asc"),
      limit(1)
    );
    const reminderSnapshot = await getDocsFn(remindersQ);
    const nextReminder = reminderSnapshot.empty ? null : {
      ...(reminderSnapshot.docs[0].data() as object),
      id: reminderSnapshot.docs[0].id
    } as Reminder;

    return {
      ...clientData,
      id: docSnap.id,
      noteCount: countSnapshot.data().count,
      nextReminder
    } as Client;
  }));

  return clients as Client[];
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
  return { ...(querySnapshot.docs[0].data() as object), id: querySnapshot.docs[0].id } as Client;
}

export async function getNotes(clientId: string) {
  const q = query(
    collection(db, "notes"),
    where("clientId", "==", clientId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map(doc => ({
    ...(doc.data() as object),
    id: doc.id
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
export async function getReminders(clientId: string) {
  const q = query(
    collection(db, "reminders"),
    where("clientId", "==", clientId),
    orderBy("remindAt", "asc")
  );

  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map(doc => ({
    ...(doc.data() as object),
    id: doc.id
  })) as Reminder[];
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
