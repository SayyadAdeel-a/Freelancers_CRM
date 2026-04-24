import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { invoice, userEmail, userId, userName } = await req.json();

    if (!invoice || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    let { invoiceNumber, clientName, clientEmail, clientId, total, lineItems, dueDate, notes } = invoice;
    const senderName = userName || "Nudge CRM User";
    
    // If clientEmail is missing (legacy invoice), try to fetch it from Firestore
    if (!clientEmail && clientId && userId) {
      try {
        const { getClient } = await import("@/lib/firebase/firestore");
        const client = await getClient(clientId, userId);
        if (client && client.email) {
          clientEmail = client.email;
        }
      } catch (err) {
        console.error("Failed to fetch client email:", err);
      }
    }

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

    const { error } = await resend.emails.send({
      from: `${senderName} via Nudge <invoices@mail.adeelsayyad.tech>`,
      to: [recipientEmail],
      replyTo: userEmail,
      subject: `Invoice ${invoiceNumber} from ${senderName}`,
      html: `
        <div style="background-color: #ffffff; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; padding: 0;">
          <div style="height: 4px; background-color: #ff0000;"></div>
          
          <div style="padding: 40px;">
            <!-- Header -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px; border-bottom: 2px solid #000000;">
              <tr>
                <td align="left" style="padding-bottom: 20px;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">INVOICE</h1>
                  <p style="margin: 4px 0 0; font-family: ui-monospace, monospace; font-size: 12px; color: #666666;">${invoiceNumber}</p>
                </td>
                <td align="right" style="padding-bottom: 20px;">
                  <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Date Issued</p>
                  <p style="margin: 2px 0 0; font-family: ui-monospace, monospace; font-size: 13px; font-weight: 600;">${new Date().toLocaleDateString()}</p>
                </td>
              </tr>
            </table>

            <!-- Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
              <tr>
                <td width="50%" align="left" valign="top">
                  <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999; margin-bottom: 8px;">Bill To</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 800;">${clientName}</p>
                  <p style="margin: 2px 0 0; font-family: ui-monospace, monospace; font-size: 12px; color: #666666;">${clientEmail || ""}</p>
                </td>
                <td width="50%" align="right" valign="top">
                  <p style="margin: 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999; margin-bottom: 8px;">Payment Due</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 800; color: #ff0000;">${new Date(dueDate.seconds * 1000).toLocaleDateString()}</p>
                </td>
              </tr>
            </table>

            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
              <thead>
                <tr style="border-bottom: 1px solid #000000;">
                  <th align="left" style="padding: 10px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Description</th>
                  <th align="right" style="padding: 10px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
              <tr>
                <td align="right">
                  <table cellpadding="0" cellspacing="0" style="width: 200px; background-color: #fcfcfc; border: 1px solid #eeeeee;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="left" style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #999999;">Total</td>
                            <td align="right" style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">${formatCurrency(total)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Notes -->
            ${notes ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                <tr>
                  <td style="padding: 20px; border: 1px dashed #eeeeee; border-radius: 4px;">
                    <p style="margin: 0 0 5px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #999999;">Notes</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #333333;">${notes}</p>
                  </td>
                </tr>
              </table>
            ` : ""}

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #eeeeee; padding-top: 30px;">
              <tr>
                <td align="left">
                  <p style="margin: 0; font-size: 13px; font-weight: 700; color: #000000;">${senderName}</p>
                  <p style="margin: 2px 0 0; font-size: 11px; color: #999999; font-family: ui-monospace, monospace;">via Nudge CRM</p>
                </td>
                <td align="right">
                  <img src="https://app.adeelsayyad.tech/logo.svg" alt="Nudge Logo" width="60" style="display: block; opacity: 0.6;" />
                </td>
              </tr>
            </table>
          </div>
        </div>
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
