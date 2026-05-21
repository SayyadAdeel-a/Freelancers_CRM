/**
 * Dynamic Client-Side PDF Generation Utility.
 * Converts styled HTML templates into pixel-perfect downloadable or uploadable PDF blobs.
 * Bypasses build bundle size limits and Content Security Policy (CSP) errors by utilizing
 * dynamic imports (code-splitting) from local bundled assets.
 */

/**
 * Renders a high-fidelity retro-industrial A4 invoice off-screen and compiles it into a PDF binary Blob.
 * 
 * @param invoice Full Invoice metadata payload
 * @returns Binary Blob of the generated PDF document
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateInvoicePdf(invoice: any): Promise<Blob> {

  if (typeof window === "undefined") {
    throw new Error("PDF compiler must be run within a browser environment.");
  }

  // Load compilers dynamically from local bundle (CSP Compliant & Zero initial bundle overhead!)
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  // Create A4 canvas container (794px width matches A4 aspect ratio at 96 DPI)
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "794px";
  container.style.minHeight = "1123px";
  container.style.padding = "54px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#0f172a";
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.justifyContent = "space-between";
  container.style.boxSizing = "border-box";

  // Date formatting helpers
  const formattedIssueDate = new Date(invoice.issueDate?.toDate ? invoice.issueDate.toDate() : invoice.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const formattedDueDate = new Date(invoice.dueDate?.toDate ? invoice.dueDate.toDate() : invoice.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Compile line items HTML
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItemsHtml = invoice.lineItems.map((item: any) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 14px 0; text-align: left; font-size: 13px; font-weight: 600; color: #0f172a;">
        ${item.description}
      </td>
      <td style="padding: 14px 0; text-align: center; font-size: 13px; font-family: monospace; color: #475569;">
        ${item.quantity}
      </td>
      <td style="padding: 14px 0; text-align: right; font-size: 13px; font-family: monospace; color: #475569;">
        $${Number(item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td style="padding: 14px 0; text-align: right; font-size: 13px; font-weight: 800; font-family: monospace; color: #0f172a;">
        $${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div style="width: 100%; display: flex; flex-direction: column; flex-grow: 1;">
      <!-- Statement Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0f172a; padding-bottom: 24px; margin-bottom: 40px;">
        <div>
          <h1 style="font-size: 36px; font-weight: 900; letter-spacing: -0.06em; margin: 0; color: #0f172a; text-transform: uppercase;">
            STATEMENT
          </h1>
          <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b; margin: 6px 0 0 0;">
            Nudge Statement Ref: ${invoice.invoiceNumber}
          </p>
        </div>
        <div style="text-align: right; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; line-height: 1.5;">
          <div>Issue Date: <span style="color: #0f172a; font-weight: 700;">${formattedIssueDate}</span></div>
          <div style="margin-top: 2px;">Due Date: <span style="color: #ef4444; font-weight: 700;">${formattedDueDate}</span></div>
        </div>
      </div>

      <!-- Parties Block -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px;">
        <div>
          <span style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #64748b; display: block; margin-bottom: 8px;">
            Issued To
          </span>
          <div style="font-size: 18px; font-weight: 850; color: #0f172a; letter-spacing: -0.02em;">${invoice.clientName}</div>
          ${invoice.clientCompany ? `<div style="font-size: 13px; color: #334155; margin-top: 4px; font-weight: 500;">${invoice.clientCompany}</div>` : ""}
          <div style="font-size: 12px; color: #64748b; margin-top: 4px; font-family: monospace;">${invoice.clientEmail}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #64748b; display: block; margin-bottom: 8px;">
            Liquidity Gateway
          </span>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">Bank Wire / Credit Transfer</div>
          ${invoice.paymentUrl ? `
            <div style="font-size: 11px; color: #3b82f6; margin-top: 6px; font-family: monospace; word-break: break-all; max-width: 300px; margin-left: auto; font-weight: 600;">
              Secure Redirect Configured
            </div>
          ` : ""}
        </div>
      </div>

      <!-- Line Items -->
      <div style="margin-bottom: 50px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #0f172a;">
              <th style="padding: 12px 0; text-align: left; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b;">
                Description
              </th>
              <th style="padding: 12px 0; text-align: center; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; width: 60px;">
                Qty
              </th>
              <th style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; width: 110px;">
                Rate
              </th>
              <th style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; width: 110px;">
                Amount
              </th>
            </tr>
          </thead>
          <tbody style="border-bottom: 1px solid #cbd5e1;">
            ${lineItemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Totals & Balances -->
      <div style="display: flex; justify-content: flex-end; margin-top: auto; padding-top: 20px;">
        <div style="width: 320px; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 2px; font-family: monospace; font-size: 12px; color: #475569; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal</span>
            <span>$${Number(invoice.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          ${invoice.taxRate ? `
            <div style="display: flex; justify-content: space-between;">
              <span>Tax (${invoice.taxRate}%)</span>
              <span>+$${Number(invoice.taxAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          ` : ""}
          ${invoice.discount ? `
            <div style="display: flex; justify-content: space-between; color: #ef4444; font-weight: 600;">
              <span>Discount</span>
              <span>-$${Number(invoice.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          ` : ""}
          <div style="border-top: 2px solid #0f172a; margin-top: 10px; padding-top: 12px; font-size: 14px; font-weight: 900; color: #0f172a; display: flex; justify-content: space-between; letter-spacing: -0.02em;">
            <span style="text-transform: uppercase; letter-spacing: 0.05em;">Total Balance Due</span>
            <span style="font-size: 16px; font-family: system-ui, sans-serif; font-weight: 900; letter-spacing: -0.05em; color: #0f172a;">
              $${Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes & Legal footer -->
    <div style="margin-top: 80px; border-top: 1px solid #e2e8f0; padding-top: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        ${invoice.notes ? `
          <div style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin-bottom: 6px;">
            Statement Notes
          </div>
          <p style="font-size: 12px; color: #334155; margin: 0; max-width: 480px; line-height: 1.5; font-weight: 500;">
            ${invoice.notes}
          </p>
        ` : ""}
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8;">
        Secured by Nudgr
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Compile using 2x resolution to preserve vector sharp quality
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    
    // Output raw binary Blob
    return pdf.output("blob");
  } finally {
    // Secure cleanup of off-screen DOM
    document.body.removeChild(container);
  }
}
