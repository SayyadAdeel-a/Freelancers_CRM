import { doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, getDocs, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";
import { auth } from "./auth-config";

export type UserRole = "user" | "client";

export interface UserDocument {
  uid: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
  referralCode?: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "inactive" | "prospect";
  tags?: string[];
  notesCount: number;
}

export interface NoteDocument {
  id: string;
  clientId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  reminderAt?: Date;
}

export interface ReminderDocument {
  id: string;
  noteId: string;
  userId: string;
  scheduledAt: Date;
  message: string;
  sentAt?: Date;
}

// User helpers
export const userDoc = (uid: string) => doc(db, "users", uid);
export const getUser = async (uid: string) => {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? (snap.data() as UserDocument) : null;
};
export const setUser = async (uid: string, data: Partial<UserDocument>) => {
  await setDoc(userDoc(uid), { ...data, uid }, { merge: true });
};

// Client helpers
export const clientsCollection = () => collection(db, "clients");
export const clientDoc = (id: string) => doc(db, "clients", id);
export const createClient = async (client: Omit<ClientDocument, "id" | "createdAt" | "updatedAt" | "ownerId" | "notesCount">) => {
  const ownerId = auth.currentUser?.uid;
  if (!ownerId) throw new Error("No auth user");
  const now = new Date();
  const ref = await addDoc(clientsCollection(), { ...client, ownerId, notesCount: 0, createdAt: now, updatedAt: now });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
};
export const getClients = async (ownerId: string) => {
  const q = query(clientsCollection(), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientDocument));
};

// Note helpers
export const notesCollection = () => collection(db, "notes");
export const createNote = async (note: Omit<NoteDocument, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const ref = await addDoc(notesCollection(), { ...note, createdAt: now, updatedAt: now });
  return ref.id;
};
export const getNotesByClient = async (clientId: string) => {
  const q = query(notesCollection(), where("clientId", "==", clientId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as NoteDocument));
};

// Reminder helpers
export const remindersCollection = () => collection(db, "reminders");
export const createReminder = async (reminder: Omit<ReminderDocument, "id" | "scheduledAt">) => {
  const ref = await addDoc(remindersCollection(), reminder);
  return ref.id;
};