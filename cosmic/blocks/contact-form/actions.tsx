"use server";

import { cosmic } from "@/cosmic/client";
import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@hyzync.com";
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
  const { metadata: metadata, title } = comment;

  try {
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

    // Send confirmation email
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

    // Send email to admin
    await sendEmail({
      to: CONTACT_EMAIL,
      from: CONTACT_EMAIL,
      reply_to: metadata.email,
      subject: adminSubject,
      html: adminHTML,
    });

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error in addSubmission:", err.message);
    } else {
      console.error("Error in addSubmission:", err);
    }
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
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error in sendEmail:", err.message);
    } else {
      console.error("Error in sendEmail:", err);
    }
    throw err;
  }
}
