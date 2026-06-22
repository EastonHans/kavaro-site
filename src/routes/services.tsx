import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import { supabase } from "@/lib/supabase";
import styles from "./Services.module.css";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Services & Pricing — Kavaro Agency" },
      {
        name: "description",
        content:
          "UI/UX design, graphic design, web development and AI solutions. Transparent tiered pricing in KES and USD.",
      },
      {
        property: "og:title",
        content: "Services & Pricing — Kavaro Agency",
      },
      {
        property: "og:description",
        content:
          "UI/UX design, graphic design, web development and AI solutions from a remote digital agency in Nairobi. Transparent, fixed pricing.",
      },
    ],
  }),
});

type Tier = {
  name: string;
  price: string;
  usd: string;
  timeline: string;
  features: string[];
  popular?: boolean;
};

type Service = {
  num: string;
  title: string;
  tag: string;
  desc: string;
  tiers: Tier[];
};

const services: Service[] = [
  {
    num: "01",
    title: "UI / UX Design",
    tag: "Design",
    desc: "User-centered interfaces designed in Figma, built around how real people use your product. Every screen is mobile-first, accessibility-conscious and developer-ready.",
    tiers: [
      {
        name: "Landing Page",
        price: "KES 15,000 – 25,000",
        usd: "$110 – $185",
        timeline: "3 – 5 working days",
        features: [
          "1 – 3 screens",
          "Figma mockup",
          "Mobile-first layout",
          "1 round of revisions",
        ],
      },
      {
        name: "Business Website",
        price: "KES 35,000 – 60,000",
        usd: "$260 – $445",
        timeline: "7 – 12 working days",
        popular: true,
        features: [
          "4 – 8 screens",
          "Full user flow",
          "Design system basics",
          "Interactive prototype",
          "2 rounds of revisions",
        ],
      },
      {
        name: "App / Dashboard",
        price: "KES 70,000 – 120,000",
        usd: "$520 – $890",
        timeline: "14 – 21 working days",
        features: [
          "8 – 15 screens",
          "Full user flows & wireframes",
          "Interactive Figma prototype",
          "Design system",
          "Developer handoff notes",
        ],
      },
    ],
  },
  {
    num: "02",
    title: "Graphic Design",
    tag: "Design",
    desc: "Visual assets that make your business look credible and consistent — from a first logo to a full pitch deck. Clean, modern and delivered fast.",
    tiers: [
      {
        name: "Social Media Pack",
        price: "KES 8,000 – 15,000",
        usd: "$60 – $110",
        timeline: "2 – 4 working days",
        features: [
          "5 post templates",
          "Profile & cover headers",
          "Story templates",
          "Editable source files",
        ],
      },
      {
        name: "Logo + Brand Kit",
        price: "KES 12,000 – 20,000",
        usd: "$90 – $150",
        timeline: "4 – 7 working days",
        popular: true,
        features: [
          "Logo (3 concepts)",
          "Color palette & fonts",
          "Brand guide PDF",
          "All file formats",
        ],
      },
      {
        name: "Pitch Deck / Stationery",
        price: "KES 10,000 – 18,000",
        usd: "$75 – $135",
        timeline: "3 – 6 working days",
        features: [
          "10 – 15 slide deck",
          "Branded & editable",
          "Business cards & letterhead",
          "Email signature",
        ],
      },
    ],
  },
  {
    num: "03",
    title: "Web Development",
    tag: "Development",
    desc: "Production-ready websites and web apps built with React and Node.js. Every project is responsive, tested across devices and handed off with documentation and 30 days of post-launch support.",
    tiers: [
      {
        name: "Landing Page",
        price: "KES 20,000 – 35,000",
        usd: "$150 – $260",
        timeline: "4 – 7 working days",
        features: [
          "Single-page site",
          "Responsive design",
          "Contact form",
          "Deployed & live",
          "30-day support",
        ],
      },
      {
        name: "Business Website",
        price: "KES 45,000 – 80,000",
        usd: "$335 – $595",
        timeline: "10 – 18 working days",
        popular: true,
        features: [
          "4 – 6 pages",
          "Contact & booking integrations",
          "SEO basics",
          "CMS / blog (optional)",
          "30-day support",
        ],
      },
      {
        name: "Booking / E-commerce",
        price: "KES 80,000 – 220,000",
        usd: "$595 – $1,630",
        timeline: "3 – 8 weeks",
        features: [
          "Appointment booking or product catalogue",
          "M-Pesa / payment integration",
          "Admin dashboard",
          "User accounts (optional)",
          "30-day support",
        ],
      },
    ],
  },
  {
    num: "04",
    title: "Brand Basics",
    tag: "Strategy",
    desc: "A clear name, message and visual direction for new businesses. No bloated strategy decks — just the essentials that help you show up consistently from day one.",
    tiers: [
      {
        name: "Brand Starter",
        price: "KES 12,000 – 20,000",
        usd: "$90 – $150",
        timeline: "3 – 5 working days",
        features: [
          "Name & tagline review",
          "Color palette & fonts",
          "Tone of voice doc",
          "Social bio & profile setup",
        ],
      },
      {
        name: "Brand Foundation",
        price: "KES 25,000 – 40,000",
        usd: "$185 – $300",
        timeline: "7 – 10 working days",
        popular: true,
        features: [
          "Everything in Brand Starter",
          "Logo design",
          "One-page brand guide",
          "Business card design",
          "Social profile setup",
        ],
      },
    ],
  },
  {
    num: "05",
    title: "AI-Enhanced Features",
    tag: "AI",
    desc: "Practical AI added to your website or product — chat assistants, smart forms, automation and OpenAI integrations. AI that actually helps your customers, not buzzword AI.",
    tiers: [
      {
        name: "AI Chat Widget",
        price: "KES 25,000 – 45,000",
        usd: "$185 – $335",
        timeline: "5 – 8 working days",
        features: [
          "FAQ-trained chatbot",
          "Embedded on your site",
          "Email & Calendly handoff",
          "Custom branding",
        ],
      },
      {
        name: "AI Content Assistant",
        price: "KES 35,000 – 60,000",
        usd: "$260 – $445",
        timeline: "7 – 12 working days",
        popular: true,
        features: [
          "Auto-generated copy",
          "Smart contact forms",
          "Basic workflow automation",
          "OpenAI API integration",
        ],
      },
      {
        name: "Custom AI Integration",
        price: "KES 80,000 – 150,000+",
        usd: "$595 – $1,110+",
        timeline: "3 – 6 weeks",
        features: [
          "Custom OpenAI logic",
          "Backend & database",
          "Admin dashboard",
          "Full documentation",
        ],
      },
    ],
  },
];

function registerBookedCall(name: string | null, email: string | null, service: string | null, calendlyUrl: string) {
  supabase.from("booked_calls").insert({
    name,
    email,
    service,
    calendly_url: calendlyUrl,
  }).then(() => {});
}

function Services() {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/hello-kavaro/30min";
  // PopupModal requires a direct event URL, not the profile landing page.
  // Append /30min if the URL doesn't already point to a specific event.
  const calendlyEventUrl = calendlyUrl.endsWith("/")
    ? `${calendlyUrl}30min`
    : calendlyUrl.includes("/30min") || calendlyUrl.includes("/discovery")
      ? calendlyUrl
      : `${calendlyUrl}/30min`;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Fires when the visitor completes booking on the Calendly popup.
  // The event payload contains their name and email.
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      // The react-calendly types only expose `uri` on invitee, but the
      // full payload includes name and email at runtime.
      const invitee = e.data.payload?.invitee as unknown as {
        name?: string;
        email?: string;
      } | undefined;
      registerBookedCall(
        invitee?.name ?? null,
        invitee?.email ?? null,
        selectedService,
        calendlyEventUrl,
      );
      setModalOpen(false);
    },
  });

  function openCalendly(serviceName: string) {
    setSelectedService(serviceName);
    setModalOpen(true);
  }

  return (
    <main>
      {typeof window !== "undefined" && (
        <PopupModal
          url={calendlyEventUrl}
          onModalClose={() => setModalOpen(false)}
          open={modalOpen}
          rootElement={document.body}
        />
      )}

      <div className="page-hero">
        <div className="section-label">Services & Pricing</div>
        <h1>
          Transparent Pricing. <em>Real Deliverables.</em>
        </h1>
        <p>
          Every price below is fixed — no surprise invoices, no vague hourly billing. Choose the
          tier that fits your project and budget. Not sure? Book a free discovery call and we will
          recommend the right scope for you.
        </p>
      </div>

      <section className={styles.section}>
        {services.map((s) => (
          <div className={styles.serviceBlock} key={s.num}>
            <div className={styles.serviceHead}>
              <div className={styles.serviceHeadLeft}>
                <span className={styles.num}>{s.num}</span>
                <div>
                  <div className={styles.serviceHeadTop}>
                    <h2 className={styles.title}>{s.title}</h2>
                    <span className={styles.tag}>{s.tag}</span>
                  </div>
                  <p className={styles.desc}>{s.desc}</p>
                </div>
              </div>
            </div>

            <div className={styles.tiersGrid}>
              {s.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`${styles.tierCard} ${tier.popular ? styles.tierPopular : ""}`}
                >
                  {tier.popular && (
                    <div className={styles.popularBadge}>Most Popular</div>
                  )}
                  <div className={styles.tierName}>{tier.name}</div>
                  <div className={styles.tierPrice}>{tier.price}</div>
                  <div className={styles.tierUsd}>{tier.usd}</div>
                  <div className={styles.tierTimeline}>Delivered in {tier.timeline}</div>
                  <ul className={styles.tierFeatures}>
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className={styles.tierActions}>
                    <button
                      className="btn-primary"
                      onClick={() => openCalendly(s.title)}
                    >
                      Book a Call
                    </button>
                    <Link to="/contact" className="btn-navy">
                      Get Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={styles.customSection}>
        <h2>Need Something Custom?</h2>
        <p>
          Every business is different. If your project doesn't fit neatly into the tiers above,
          reach out and we will scope it properly before quoting.
        </p>
        <Link to="/contact" className="btn-primary">
          Discuss Your Project
        </Link>
      </section>
    </main>
  );
}

export default Services;
