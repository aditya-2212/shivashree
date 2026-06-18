import { Resend } from "resend";

const SALES_INBOX_DEFAULT = "finance@shivashreedevelopers.com";

export interface ContactEnquiryEmailPayload {
  name: string;
  mobile: string;
  email?: string | null;
  lookingIn?: string | null;
  projectEnquiry?: string | null;
  source: string;
  /** Recipient override from Site Settings (admin-editable). */
  to?: string | null;
}

/** Sends the contact-page enquiry to the sales inbox via Resend. */
export async function sendContactEnquiryEmail(
  payload: ContactEnquiryEmailPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = process.env.EMAIL_FROM?.trim();
  if (!from) {
    throw new Error("EMAIL_FROM is not configured");
  }

  // Priority: admin Site Settings → env override → built-in default.
  const to =
    payload.to?.trim() || process.env.SALES_INBOX_EMAIL?.trim() || SALES_INBOX_DEFAULT;

  const lines = [
    "New enquiry from the Contact Us page",
    "",
    `Name: ${payload.name}`,
    `Mobile: ${payload.mobile}`,
    payload.email ? `Email: ${payload.email}` : null,
    payload.lookingIn ? `Looking in: ${payload.lookingIn}` : null,
    payload.projectEnquiry ? `Interest: ${payload.projectEnquiry}` : null,
    "",
    `Source: ${payload.source}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  const html = `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${lines
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")}</pre>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Website enquiry — ${payload.name}`,
    text: lines,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
