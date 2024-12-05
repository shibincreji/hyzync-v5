// app/contact/page.tsx
import { ContactForm } from "@/cosmic/blocks/contact-form/ContactForm";
export default async function ContactPage() {
  return (
    <>
      <ContactForm className="w-full max-w-[500px] m-auto my-10" />
    </>
  );
}
