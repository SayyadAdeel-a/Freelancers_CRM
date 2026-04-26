import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  limit,
  getCountFromServer,
  Timestamp,
  FieldValue,
  DocumentData,
  Query,
  collectionGroup,
} from "firebase/firestore";
import { db } from "./config";

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  createdAt: Timestamp | FieldValue;
  lastContacted?: Timestamp | FieldValue;
  plan?: string;
  noteCount?: number;
  nextReminder?: Reminder | null;
  payerRating?: "fast" | "average" | "slow" | "difficult" | null;
}

export interface Reminder {
  id: string;
  clientId: string;
  userId: string;
  remindAt: Timestamp | FieldValue;
  message: string;
  isSent: boolean;
  createdAt: Timestamp | FieldValue;
}

export interface UserProfile {
  uid: string;
  plan: "free" | "pro";
  notifications: boolean;
  displayName?: string;
  companyName?: string;
  createdAt: Timestamp | FieldValue;
}

export interface Note {
  id: string;
  clientId: string;
  userId?: string;
  content: string;
  createdAt: Timestamp | FieldValue;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  userId: string;
  issueDate: Timestamp | FieldValue;
  dueDate: Timestamp | FieldValue;
  lineItems: { description: string; amount: number }[];
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  notes?: string;
  createdAt: Timestamp | FieldValue;
  sentAt?: Timestamp | FieldValue | null;
  paidAt?: Timestamp | FieldValue | null;
}

export { query, collection, collectionGroup, where, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs };
export const getDocsFn = getDocs;

export async function getDocsData(collectionRef: Query<DocumentData>) {
  const q = query(collectionRef);
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...(d.data() as object), id: d.id }));
}

export async function getClients(userId: string) {
  const q = query(collection(db, "clients"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocsFn(q);
  const clients = await Promise.all(
    querySnapshot.docs.map(async (docSnap) => {
      const notesQ = query(collection(db, "notes"), where("clientId", "==", docSnap.id), where("userId", "==", userId));
      const countSnapshot = await getCountFromServer(notesQ);

      const remindersQ = query(
        collection(db, "reminders"),
        where("userId", "==", userId),
        where("clientId", "==", docSnap.id),
        where("isSent", "==", false),
        where("remindAt", ">=", new Date()),
        orderBy("remindAt", "asc"),
        limit(1)
      );
      const reminderSnapshot = await getDocsFn(remindersQ);
      const nextReminder = reminderSnapshot.empty
        ? null
        : ({ ...(reminderSnapshot.docs[0].data() as object), id: reminderSnapshot.docs[0].id } as Reminder);

      return { ...docSnap.data(), id: docSnap.id, noteCount: countSnapshot.data().count, nextReminder } as Client;
    })
  );
  return clients;
}

export async function addClient(userId: string, clientData: Omit<Client, "id" | "userId" | "createdAt">) {
  return addDoc(collection(db, "clients"), { userId, ...clientData, createdAt: serverTimestamp() });
}

export async function updateClient(clientId: string, data: Partial<Client>) {
  return updateDoc(doc(db, "clients", clientId), data);
}

export async function deleteClient(clientId: string) {
  return deleteDoc(doc(db, "clients", clientId));
}

export async function getClient(clientId: string, userId: string) {
  const q = query(collection(db, "clients"), where("__name__", "==", clientId), where("userId", "==", userId));
  const querySnapshot = await getDocsFn(q);
  if (querySnapshot.empty) return null;
  return { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id } as Client;
}

export async function getNotes(clientId: string, userId: string) {
  const q = query(
    collection(db, "notes"), 
    where("clientId", "==", clientId), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Note[];
}

export async function createNote(clientId: string, userId: string, content: string) {
  return addDoc(collection(db, "notes"), { clientId, userId, content, createdAt: serverTimestamp() });
}

export async function getNotesByClient(clientId: string, userId: string) {
  return getNotes(clientId, userId);
}

export async function getReminders(clientId: string, userId: string) {
  const q = query(
    collection(db, "reminders"),
    where("userId", "==", userId),
    where("clientId", "==", clientId),
    orderBy("remindAt", "asc")
  );
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Reminder[];
}

export async function addReminder(clientId: string, userId: string, remindAt: Date, message: string) {
  return addDoc(collection(db, "reminders"), { clientId, userId, remindAt, message, isSent: false, createdAt: serverTimestamp() });
}

export async function getAllReminders(userId: string) {
  const q = query(collection(db, "reminders"), where("userId", "==", userId), orderBy("remindAt", "asc"));
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Reminder[];
}

export async function deleteReminder(reminderId: string) {
  return deleteDoc(doc(db, "reminders", reminderId));
}

export async function getNotesThisWeek(userId: string) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const q = query(collection(db, "notes"), where("userId", "==", userId), where("createdAt", ">=", oneWeekAgo));
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.size;
}

export async function getUpcomingReminders(userId: string) {
  const now = new Date();
  const q = query(
    collection(db, "reminders"),
    where("userId", "==", userId),
    where("isSent", "==", false),
    where("remindAt", ">=", now),
    orderBy("remindAt", "asc"),
    limit(5)
  );
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Reminder[];
}

export async function getUserProfile(uid: string) {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) return docSnap.data() as UserProfile;
  return null;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile> = {}) {
  await setDoc(doc(db, "users", uid), { uid, plan: "free", notifications: true, createdAt: serverTimestamp(), ...data }, { merge: true });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), data as DocumentData);
}

// Invoicing functions
export async function getInvoices(clientId: string, userId: string) {
  const q = query(
    collection(db, "clients", clientId, "invoices"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Invoice[];
}

export async function getAllUserInvoices(userId: string) {
  const q = query(
    collectionGroup(db, "invoices"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocsFn(q);
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })) as Invoice[];
}

export async function addInvoice(clientId: string, userId: string, invoiceData: Omit<Invoice, "id" | "clientId" | "userId" | "createdAt">) {
  return addDoc(collection(db, "clients", clientId, "invoices"), {
    ...invoiceData,
    clientId,
    userId,
    createdAt: serverTimestamp()
  });
}

export async function updateInvoice(clientId: string, invoiceId: string, data: Partial<Invoice>) {
  return updateDoc(doc(db, "clients", clientId, "invoices", invoiceId), data);
}

export async function getInvoiceById(invoiceId: string) {
  // Use collectionGroup to find the invoice since we might not have the clientId in the URL
  const q = query(collectionGroup(db, "invoices"), where("__name__", "==", invoiceId));
  const querySnapshot = await getDocsFn(q);
  if (querySnapshot.empty) return null;
  const d = querySnapshot.docs[0];
  return { ...d.data(), id: d.id } as Invoice;
}
export async function getClientCount(userId: string) {
  const q = query(collection(db, "clients"), where("userId", "==", userId));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}
