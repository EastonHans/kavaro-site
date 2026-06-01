import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { contactAPI, type ContactPayload } from "@/lib/api";
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

const services = [
  "UI / UX Design",
  "Graphic Design",
  "Web Development",
  "AI Solutions",
  "Brand Identity",
  "Digital Marketing",
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
  type: "success" | "error" | "warning";
  msg: string;
};

function Contact() {
  const emailConfigured = Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/hello-kavaro";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

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

      // Validate required fields
      if (!payload.name || !payload.email || !payload.message) {
        throw new Error("Please fill in all required fields (Name, Email, Message)");
      }

      const lead = {
        id: Date.now().toString(),
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        service: payload.service || undefined,
        message: payload.message,
        date: new Date().toLocaleDateString(),
        status: "new" as const,
        emailSent: false,
      };

      if (emailConfigured) {
        const response = await contactAPI.send(payload);

        if (response.status === 200) {
          lead.emailSent = true;
          setStatus({
            type: "success",
            msg: "Thank you! Your inquiry has been received. We'll respond within 24 hours.",
          });
        } else {
          throw new Error("Failed to send message. Please try again.");
        }
      } else {
        setStatus({
          type: "warning",
          msg: "EmailJS is not configured. Your inquiry has been saved locally for the admin dashboard.",
        });
      }

      const existingLeads = localStorage.getItem("kavaro_leads");
      const leadsArray = existingLeads ? JSON.parse(existingLeads) : [];
      leadsArray.push(lead);
      localStorage.setItem("kavaro_leads", JSON.stringify(leadsArray));

      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setStatus({
        type: "error",
        msg: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="page-hero">
        <h1>Let's Build Something Together</h1>
        <p>We reply within 24 hours</p>
      </div>

      <div className={`${styles.container} ${styles.grid}`}>
        <form onSubmit={handleSubmit} className={styles.form}>
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
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              id="phone"
              type="tel"
              placeholder="+254 (optional)"
              value={form.phone}
              onChange={handleChange("phone")}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="service">Service Interested In *</label>
            <select value={form.service} onChange={handleChange("service")} id="service" required>
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Project Details *</label>
            <textarea
              id="message"
              placeholder="Tell us about your project, goals, and timeline..."
              value={form.message}
              onChange={handleChange("message")}
              required
              rows={6}
            />
          </div>

          {/* EmailJS config message intentionally hidden in UI */}
          {status && (
            <div
              className={`${styles.alert} ${
                status.type === "success"
                  ? styles.alertSuccess
                  : status.type === "warning"
                    ? styles.alertWarning
                    : styles.alertError
              }`}
              role="alert"
            >
              {status.msg}
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className={styles.info}>
          <div className={styles.infoBlock}>
            <h3>Questions?</h3>
            <p>
              Email us at <a href="mailto:hello.kavaro@gmail.com">hello.kavaro@gmail.com</a>
            </p>
          </div>

          <div className={styles.infoBlock}>
            <h3>Book a Call</h3>
            <p>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
                onClick={() => {
                  const calls = JSON.parse(localStorage.getItem("kavaro_booked_calls") || "[]");
                  calls.push({
                    id: Date.now().toString(),
                    date: new Date().toLocaleString(),
                    url: calendlyUrl,
                  });
                  localStorage.setItem("kavaro_booked_calls", JSON.stringify(calls));
                }}
              >
                Schedule a discovery call
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
