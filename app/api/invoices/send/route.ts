import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { invoice, userEmail, userName } = await req.json();

    if (!invoice || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const { invoiceNumber, clientName, clientEmail, total, lineItems, dueDate, notes } = invoice;
    const recipientEmail = clientEmail || userEmail; // Fallback to user for old invoices

    // Format currency
    const formatCurrency = (amt: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

    const itemsHtml = lineItems.map((item: any) => `
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 16px 0; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 13px; color: #1a1a1a;">${item.description}</td>
        <td style="padding: 16px 0; text-align: right; font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 13px; color: #1a1a1a; font-weight: 600;">${formatCurrency(item.amount)}</td>
      </tr>
    `).join("");

    const { error } = await resend.emails.send({
      from: `${userName} via Nudge <invoices@mail.adeelsayyad.tech>`,
      to: [recipientEmail],
      reply_to: userEmail,
      subject: `Invoice ${invoiceNumber} from ${userName}`,
      html: `
        <div style="background-color: #ffffff; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e5e5; padding: 0;">
          <!-- Top Accent -->
          <div style="height: 4px; background-color: #ff0000;"></div>
          
          <div style="padding: 48px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 24px; margin-bottom: 48px;">
              <div style="flex: 1;">
                <h1 style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase; line-height: 1;">INVOICE</h1>
                <p style="margin: 8px 0 0; font-family: ui-monospace, monospace; font-size: 14px; color: #666666; font-weight: 500;">${invoiceNumber}</p>
              </div>
              <div style="text-align: right; flex: 1;">
                <p style="margin: 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666666;">Date Issued</p>
                <p style="margin: 4px 0 0; font-family: ui-monospace, monospace; font-size: 14px; font-weight: 600;">${new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <!-- Details Grid -->
            <div style="display: flex; gap: 40px; margin-bottom: 48px;">
              <div style="flex: 1;">
                <p style="margin: 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666666; margin-bottom: 12px;">Bill To</p>
                <p style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">${clientName}</p>
                <p style="margin: 4px 0 0; font-family: ui-monospace, monospace; font-size: 13px; color: #666666;">${clientEmail || ""}</p>
              </div>
              <div style="flex: 1; text-align: right;">
                <p style="margin: 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666666; margin-bottom: 12px;">Payment Due</p>
                <p style="margin: 0; font-size: 20px; font-weight: 800; color: #ff0000;">${new Date(dueDate.seconds * 1000).toLocaleDateString()}</p>
              </div>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
              <thead>
                <tr style="border-bottom: 1px solid #000000;">
                  <th style="text-align: left; padding: 12px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666666;">Description</th>
                  <th style="text-align: right; padding: 12px 0; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666666;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Summary -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 48px;">
              <div style="width: 240px; background-color: #f8f8f8; padding: 24px; border: 1px solid #e5e5e5;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #666666;">Total Amount</span>
                  <span style="font-size: 24px; font-weight: 900; letter-spacing: -1px;">${formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            ${notes ? `
              <div style="margin-bottom: 64px; padding: 24px; border: 1px dashed #e5e5e5; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666666;">Additional Notes</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;">${notes}</p>
              </div>
            ` : ""}

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e5e5; padding-top: 32px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #000000;">${userName}</p>
                <p style="margin: 2px 0 0; font-size: 11px; color: #666666; font-family: ui-monospace, monospace;">via Nudge CRM</p>
              </div>
              <div style="text-align: right;">
                <img src="https://app.adeelsayyad.tech/logo.svg" alt="Nudge Logo" style="height: 24px; width: auto; opacity: 0.8;" />
              </div>
            </div>
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
