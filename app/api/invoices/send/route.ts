import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { invoice, userEmail } = await req.json();

    if (!invoice || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const { invoiceNumber, clientName, total, lineItems, dueDate, notes } = invoice;

    // Format currency
    const formatCurrency = (amt: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);

    const itemsHtml = lineItems.map((item: any) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; font-family: monospace;">${item.description}</td>
        <td style="padding: 12px 0; text-align: right; font-family: monospace;">${formatCurrency(item.amount)}</td>
      </tr>
    `).join("");

    const { error } = await resend.emails.send({
      from: "Nudge CRM <invoices@mail.adeelsayyad.tech>",
      to: [userEmail], // In real app, this should be clientEmail, but for demo we send to user
      subject: `Invoice ${invoiceNumber} from Nudge CRM`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #000; padding: 40px; color: #000;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
            <div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">INVOICE</h1>
              <p style="margin: 5px 0 0; font-family: monospace; font-size: 12px; color: #666;">${invoiceNumber}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: 700;">Nudge CRM</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Freelancer Tool</p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <p style="margin: 0; font-size: 10px; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 2px;">Bill To</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: 700;">${clientName}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
              <tr style="border-bottom: 2px solid #000;">
                <th style="text-align: left; padding: 10px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666;">Description</th>
                <th style="text-align: right; padding: 10px 0; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 20px 0 0; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Total</td>
                <td style="padding: 20px 0 0; text-align: right; font-size: 24px; font-weight: 900;">${formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>

          ${notes ? `
            <div style="margin-bottom: 40px; padding: 20px; background: #f9f9f9; border-left: 4px solid #000;">
              <p style="margin: 0 0 5px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #666;">Notes</p>
              <p style="margin: 0; font-size: 14px;">${notes}</p>
            </div>
          ` : ""}

          <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 10px; color: #999; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">
            Please pay by ${new Date(dueDate.seconds * 1000).toLocaleDateString()}. Thank you.
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
