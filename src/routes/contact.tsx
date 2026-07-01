import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import { contactAPI, type ContactPayload } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import styles from "./Contact.module.css";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Kavaro — Let's Build Together" },
      {
        name: "description",
        content:
          "Get in touch with Kavaro Agency. We respond within 24 hours. Tell us about your project.",
      },
    ],
  }),
});

const BUSINESS_EMAIL = "hello@kavaroagency.com";

const serviceOptions = [
  "Web Development",
  "UI / UX Design",
  "AI-Enhanced Features",
  "Graphic Design",
  "Brand Basics",
  "Other",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type Status = {
  type: "success" | "error";
  msg: string;
};

function Contact() {
  const emailConfigured = Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );

  const calendlyUrl =
    import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/hello-kavaro/30min";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [showMessage, setShowMessage] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  // Capture name + email when visitor completes Calendly booking
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const invitee = e.data.payload?.invitee as unknown as {
        name?: string;
        email?: string;
      } | undefined;

      supabase.from("booked_calls").insert({
        name: (invitee?.name ?? form.name.trim()) || null,
        email: (invitee?.email ?? form.email.trim()) || null,
        service: form.service.trim() || null,
        calendly_url: calendlyUrl,
      }).then(() => {});

      setCalendlyOpen(false);
    },
  });

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  // Shared details fields are always required before either action
  const detailsComplete =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.service !== "";

  function handleBookCall() {
    if (!detailsComplete) return;
    setCalendlyOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const payload: ContactPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service.trim(),
        message: form.message.trim(),
      };

      if (!payload.name || !payload.email || !payload.message) {
        throw new Error("Please fill in all required fields.");
      }

      let emailSent = false;

      if (emailConfigured) {
        const response = await contactAPI.send(payload);
        if (response.status === 200) {
          emailSent = true;
        } else {
          throw new Error("Failed to send message. Please try again.");
        }
      }

      const { error: dbError } = await supabase.from("leads").insert({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        service: payload.service || null,
        message: payload.message,
        status: "new",
        email_sent: emailSent,
      });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      setStatus({
        type: "success",
        msg: "Thank you! We have received your message and will reply within 24 hours.",
      });

      setForm({ name: "", email: "", phone: "", service: "", message: "" });
      setShowMessage(false);
    } catch (err: unknown) {
      setStatus({
        type: "error",
        msg: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {typeof window !== "undefined" && (
        <PopupModal
          url={calendlyUrl}
          onModalClose={() => setCalendlyOpen(false)}
          open={calendlyOpen}
          rootElement={document.body}
        />
      )}

      <div className="page-hero">
        <h1>Let's Build Something Together</h1>
        <p>Fill in your details below, then choose how you'd like to connect.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>

          {/* ── LEFT: contact info ── */}
          <div className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Email Us</h3>
              <a href={`mailto:${BUSINESS_EMAIL}`} className={styles.sideEmail}>
                {BUSINESS_EMAIL}
              </a>
              <p>We reply within 24 hours.</p>
            </div>
            <div className={styles.sideCard}>
              <h3>Location</h3>
              <p>Remote · Nairobi, Kenya</p>
              <p>Serving clients worldwide.</p>
            </div>
            <div className={styles.sideCard}>
              <h3>What Happens Next</h3>
              <ol className={styles.steps}>
                <li>Fill in your details</li>
                <li>Send a message or book a call</li>
                <li>We reply or confirm your slot</li>
                <li>We scope your project together</li>
              </ol>
            </div>
          </div>

          {/* ── RIGHT: unified form ── */}
          <div className={styles.formWrap}>
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Shared fields — always visible ── */}
              <div className={styles.fieldset}>
                <p className={styles.fieldsetLabel}>Your Details</p>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange("name")}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      required
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+254"
                      value={form.phone}
                      onChange={handleChange("phone")}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="service">Service Interested In *</label>
                    <select
                      id="service"
                      value={form.service}
                      onChange={handleChange("service")}
                      required
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Action choice ── */}
              <div className={styles.actionChoice}>
                <p className={styles.fieldsetLabel}>How would you like to connect?</p>
                <div className={styles.actionBtns}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${showMessage ? styles.actionBtnActive : ""}`}
                    onClick={() => setShowMessage(true)}
                  >
                    <span className={styles.actionIcon}>✉</span>
                    <span className={styles.actionTitle}>Send a Message</span>
                    <span className={styles.actionSub}>We reply within 24 hours</span>
                  </button>

                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleBookCall}
                    disabled={!detailsComplete}
                    title={!detailsComplete ? "Fill in your name, email and service first" : ""}
                  >
                    <span className={styles.actionIcon}>📅</span>
                    <span className={styles.actionTitle}>Book a Discovery Call</span>
                    <span className={styles.actionSub}>Free 30-min call</span>
                  </button>
                </div>

                {!detailsComplete && (
                  <p className={styles.hint}>
                    Fill in your name, email and service above to unlock booking.
                  </p>
                )}
              </div>

              {/* ── Message textarea — shown when "Send a Message" is chosen ── */}
              {showMessage && (
                <div className={styles.messageSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Project Details *</label>
                    <textarea
                      id="message"
                      placeholder="Tell us about your project, goals, and timeline..."
                      value={form.message}
                      onChange={handleChange("message")}
                      required={showMessage}
                      rows={6}
                    />
                  </div>

                  {status && (
                    <div
                      className={`${styles.alert} ${
                        status.type === "success" ? styles.alertSuccess : styles.alertError
                      }`}
                      role="alert"
                    >
                      {status.msg}
                    </div>
                  )}

                  <div className={styles.submitRow}>
                    <button type="submit" disabled={loading} className={styles.submitBtn}>
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setShowMessage(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Success shown outside the message section */}
              {status?.type === "success" && !showMessage && (
                <div className={`${styles.alert} ${styles.alertSuccess}`} role="alert">
                  {status.msg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
