import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifySession } from "@/lib/firebase/server-auth";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // 1. Authenticate the user
    let decodedToken;
    try {
      decodedToken = await verifySession();
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId, userEmail, userName, pdfBase64 } = await req.json();

    if (!invoiceId || !userEmail) {
      return NextResponse.json({ error: "Missing required data (invoiceId and userEmail)" }, { status: 400 });
    }

    // 2. Fetch the invoice from Firestore using Admin SDK (Collection Group)
    const invoiceQuery = await adminDb.collectionGroup("invoices")
      .where("userId", "==", decodedToken.uid)
      .where("__name__", "==", invoiceId)
      .limit(1)
      .get();

    if (invoiceQuery.empty) {
      return NextResponse.json({ error: "Invoice not found or unauthorized" }, { status: 404 });
    }

    const invoiceDoc = invoiceQuery.docs[0];
    const invoice = invoiceDoc.data();
    
    // 3. Extract verified data
    let { invoiceNumber, clientName, clientEmail, total, lineItems, dueDate, notes } = invoice;
    const senderName = userName || "Nudge CRM User";
    
    const recipientEmail = clientEmail || userEmail; 

    // Format currency
    const formatCurrency = (amt: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

    const itemsHtml = lineItems.map((item: any) => `
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px 0; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 13px; color: #1a1a1a;">${item.description}</td>
        <td align="right" style="padding: 12px 0; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 13px; color: #1a1a1a; font-weight: 600;">${formatCurrency(item.amount)}</td>
      </tr>
    `).join("");

    const publicUrl = `https://app.adeelsayyad.tech/invoice/${invoiceDoc.id}`;
    
    // 4. Send verified email
    const { error } = await resend.emails.send({
      from: `${senderName} via Nudge <invoices@mail.adeelsayyad.tech>`,
      to: [recipientEmail],
      replyTo: userEmail,
      subject: `Invoice ${invoiceNumber} from ${senderName}`,
      attachments: pdfBase64 ? [
        {
          filename: `Invoice_${invoiceNumber || "Statement"}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
        }
      ] : undefined,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoiceNumber}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                  <tr>
                    <td height="4" style="background-color: #ff0000; line-height: 4px; font-size: 4px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                        <tr>
                          <td align="left">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; color: #000000;">INVOICE</h1>
                            <p style="margin: 4px 0 0; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 12px; color: #666666; letter-spacing: 1px;">REF: ${invoiceNumber}</p>
                          </td>
                          <td align="right" valign="top">
                            <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Date Issued</p>
                            <p style="margin: 2px 0 0; font-family: ui-monospace, monospace; font-size: 13px; font-weight: 600; color: #000000;">${new Date().toLocaleDateString()}</p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                        <tr>
                          <td width="50%" align="left" valign="top" style="padding-right: 20px;">
                            <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999; margin-bottom: 8px;">Bill To</p>
                            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #000000;">${clientName}</p>
                            <p style="margin: 2px 0 0; font-family: ui-monospace, monospace; font-size: 12px; color: #666666;">${clientEmail || ""}</p>
                          </td>
                          <td width="50%" align="right" valign="top">
                            <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999; margin-bottom: 8px;">Due Date</p>
                            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #ff0000;">${dueDate?.toDate ? dueDate.toDate().toLocaleDateString() : new Date(dueDate?.seconds * 1000).toLocaleDateString()}</p>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                        <tr>
                          <td align="center">
                            <a href="${publicUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 2px; font-family: ui-monospace, monospace; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">View & Pay Invoice</a>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-top: 2px solid #000000;">
                        <thead>
                          <tr>
                            <th align="left" style="padding: 12px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Description</th>
                            <th align="right" style="padding: 12px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>

                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px;">
                        <tr>
                          <td align="right">
                            <table border="0" cellspacing="0" cellpadding="0" style="width: 200px; background-color: #000000; color: #ffffff; border-radius: 2px;">
                              <tr>
                                <td style="padding: 20px;">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td align="left" style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7;">Total Due</td>
                                      <td align="right" style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">${formatCurrency(total)}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      ${notes ? `
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 40px; background-color: #fcfcfc; border: 1px dashed #e5e5e5; border-radius: 4px;">
                          <tr>
                            <td style="padding: 24px;">
                              <p style="margin: 0 0 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Additional Notes</p>
                              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #333333;">${notes}</p>
                            </td>
                          </tr>
                        </table>
                      ` : ""}

                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #eeeeee; padding-top: 30px;">
                        <tr>
                          <td align="left">
                            <p style="margin: 0; font-size: 13px; font-weight: 700; color: #000000;">${senderName}</p>
                            <p style="margin: 2px 0 0; font-size: 11px; color: #999999; font-family: ui-monospace, monospace;">via Nudge CRM Ecosystem</p>
                          </td>
                          <td align="right">
                            <img src="https://app.adeelsayyad.tech/logo.svg" alt="Nudge Logo" width="50" style="display: block; opacity: 0.5;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 20px;">
                  <tr>
                    <td align="center">
                      <p style="margin: 0; font-size: 10px; color: #999999; font-family: ui-monospace, monospace; text-transform: uppercase; letter-spacing: 1px;">
                        Sent securely from <a href="https://app.adeelsayyad.tech" style="color: #000000; text-decoration: underline; font-weight: 700;">Nudge App</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Invoice Send Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
