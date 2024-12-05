"use server";

import { cosmic } from "@/cosmic/client";
import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@hyzync.com";

console.log("RESEND_API_KEY:", RESEND_KEY ? "Loaded" : "Not Loaded");
console.log("CONTACT_EMAIL:", CONTACT_EMAIL ? "Loaded" : "Not Loaded");

const resend = new Resend(RESEND_KEY);

export type AddSubmissionType = {
  type: "form-submissions";
  title: string;
  metadata: {
    email: string;
    company: string;
    message: string;
  };
};

export async function addSubmission(comment: AddSubmissionType) {
  try {
    console.log("Attempting to add submission:", comment);

    const { metadata, title } = comment;
    const data = await cosmic.objects.insertOne(comment);

    const submitterSubject = `Form submission received`;
    const submitterHTML = `
      Hello ${title},<br/><br/>
      This is a message to confirm that we have received your form submission with the following information:<br/><br/>
      Name: ${title}<br/>
      Email: ${metadata.email}<br/>
      Company: ${metadata.company}<br/>
      Message: ${metadata.message}<br/>
      <br/>
      A representative will be in touch with you soon.
    `;

    console.log("Sending confirmation email to submitter...");
    await sendEmail({
      to: metadata.email,
      from: CONTACT_EMAIL,
      reply_to: CONTACT_EMAIL,
      subject: submitterSubject,
      html: submitterHTML,
    });

    const adminSubject = `${title} submitted the form`;
    const adminHTML = `
      ${title} submitted the contact form with the following information:<br/><br/>
      Name: ${title}<br/>
      Email: ${metadata.email}<br/>
      Company: ${metadata.company}<br/>
      Message: ${metadata.message}<br/>
    `;

    console.log("Sending admin notification...");
    await sendEmail({
      to: CONTACT_EMAIL,
      from: CONTACT_EMAIL,
      reply_to: metadata.email,
      subject: adminSubject,
      html: adminHTML,
    });

    console.log("Submission successfully processed!");
    return data;
  } catch (err) {
    console.error("Error in addSubmission:", err.message || err);
    throw err;
  }
}

async function sendEmail({
  from,
  to,
  subject,
  html,
  reply_to,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
  reply_to: string;
}) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo: reply_to,
    });
    console.log("Email sent successfully:", data);
    return data;
  } catch (err) {
    console.error(
      "Error sending email:",
      err.response?.data || err.message || err
    );
    throw err;
  }
}
