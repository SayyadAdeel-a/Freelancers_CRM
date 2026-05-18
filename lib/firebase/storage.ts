import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a compiled client-side invoice PDF Blob to Firebase Storage.
 * Saves the file securely at `/users/{userId}/invoices/{invoiceId}.pdf`.
 *
 * @param userId Firebase User ID of the logged-in freelancer
 * @param invoiceId Firestore Document ID of the target invoice
 * @param pdfBlob Compiled binary Blob of the PDF
 * @returns Secure HTTPS asset URL for sharing/emailing
 */
export async function uploadInvoicePdf(userId: string, invoiceId: string, pdfBlob: Blob): Promise<string> {
  if (!userId || !invoiceId || !pdfBlob) {
    throw new Error("Missing required parameters for PDF storage upload.");
  }

  const storageRef = ref(storage, `users/${userId}/invoices/${invoiceId}.pdf`);
  
  // Set content type metadata for proper browser rendering
  const metadata = {
    contentType: "application/pdf",
  };

  const snapshot = await uploadBytes(storageRef, pdfBlob, metadata);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  return downloadUrl;
}
