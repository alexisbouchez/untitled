import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletter(to: string, subject: string, html: string) {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Hyperbulletin <hyperbulletin@alexisbouchez.com>",
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
