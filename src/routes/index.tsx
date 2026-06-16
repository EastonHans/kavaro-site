import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import founderImg from "@/assets/founder.png";
import styles from "./Home.module.css";
import { PopupModal } from "react-calendly";

import carolineImg from "@/assets/caroline.png";
import hezronImg from "@/assets/hezron.jpeg";
import brendaImg from "@/assets/brenda.jpeg";
import carolgroceryImg from "@/assets/Carol's grocery.png";
import smargoImg from "@/assets/smargo-homepage.png";
import eastonImg from "@/assets/easton.jpeg";
import splashscreeImg from "@/assets/Splash Screen.png";
import aireactImg from "@/assets/ai-react.png";

const services = [
  {
    num: "01",
    title: "Web Development",
    desc: "Modern, AI-ready websites and platforms - landing pages, booking flows and dashboards built with care.",
    tag: "React · Node.js · TypeScript",
  },
  {
    num: "02",
    title: "AI Solutions",
    desc: "Smart assistants, automation and AI features integrated into your product where they actually help.",
    tag: "LLMs · Automation · Integration",
  },
  {
    num: "03",
    title: "UI / UX Design",
    desc: "Interfaces designed by a trained product designer - clear flows, real research, no fluff.",
    tag: "Figma · Prototyping · Research",
  },
  {
    num: "04",
    title: "Graphic Design",
    desc: "Visual identities and marketing assets that make your brand feel intentional and modern.",
    tag: "Branding · Print · Social",
  },
];
const techStack = ["React", "Node.js", "TypeScript", "Vercel"];

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Kavaro Agency - Digital Product & Web Development Agency" },

      {
        name: "description",
        content:
          "Kavaro is a remote digital agency specializing in UI/UX design, web development, and AI-powered digital solutions for modern businesses.",
      },

      {
        property: "og:title",
        content: "Kavaro Agency - Digital Product & Web Development Agency",
      },

      {
        property: "og:description",
        content:
          "A remote digital agency building modern websites, web apps, and AI-ready digital experiences.",
      },
    ],
  }),
});
const stats = [
  { num: "UI/UX", label: "Design-Led Agency" },
  { num: "100%", label: "Remote-First" },
  { num: "12h", label: "Average Reply Time" },
];

const industries = [
  {
    icon: "🏥",
    name: "Healthcare & Clinics",
    desc: "Patient portals, appointment booking, results delivery.",
  },
  {
    icon: "💊",
    name: "Pharmacies & Labs",
    desc: "Online catalogues, prescription requests, deliveries.",
  },
  {
    icon: "🎓",
    name: "Schools & Training",
    desc: "Admissions, fee portals, parent communication.",
  },
  {
    icon: "🛍️",
    name: "Local Businesses",
    desc: "Storefronts, online ordering, customer engagement.",
  },
  { icon: "💼", name: "Service Providers", desc: "Bookings, quotes, client dashboards and CRM." },
  {
    icon: "🌍",
    name: "International Brands",
    desc: "Marketing sites, SaaS products, AI integrations.",
  },
];
const skills = [
  "UI / UX Product Design",
  "Figma & Prototyping",
  "User Research",
  "Design Systems",
  "React & Python",
  "Node.js",
  "Tailwind CSS",
  "AI / LLM Integration",
  "Responsive Web",
  "Accessibility",
];
const whyUs = [
  {
    title: "Design-Led Team",
    desc: "Every project is shaped by our combined skills in UI/UX design, development, and product thinking - not templates or shortcuts.",
  },
  {
    title: "Hands-On Collaboration",
    desc: "Clients work directly with our team - designers and developers - ensuring clear communication and fast execution without unnecessary layers.",
  },
  {
    title: "Remote-First Agency",
    desc: "We operate as a distributed team, collaborating online across tools and timezones to deliver projects efficiently and consistently.",
  },
  {
    title: "AI-Ready Builds",
    desc: "Our team integrates modern AI capabilities into products - from chat systems to automation and smart workflows - where they actually add value.",
  },
];

const projects = [
  {
    title: "Healthcare Booking - Concept",
    type: "Concept Website",
    problem:
      "Local clinics in Nairobi rely on phone calls for appointments - patients wait, lines drop, no-shows are high.",
    solution:
      "A clean booking site with doctor profiles, time-slot picker, SMS reminders and a simple admin view.",
    tools: ["Figma", "React", "Tailwind", "Supabase"],
    outcome:
      "Concept prototype reduces booking friction to 3 taps. Designed mobile-first for low-bandwidth use.",
    accent: "linear-gradient(135deg, #1e3a5f, #0a1929)",
    image: splashscreeImg,
  },
  {
    title: "Smargo - Farm-to-Institution Marketplace",
    type: "Web Development Project",
    problem:
      "Farmers often rely on middlemen who reduce their earnings, while institutions like schools and hospitals struggle to access fresh produce directly from reliable suppliers.",
    solution:
      "Built a responsive marketplace interface that connects farmers directly with institutions, focusing on clarity, usability, and smooth product browsing and ordering flow.",
    tools: ["React", "TypeScript", "Vercel"],
    outcome:
      "Live deployed platform demonstrating real-world frontend development, UI structuring, and deployment of a functional marketplace interface.",
    accent: "linear-gradient(135deg, #0f172a, #1e293b)",
    image: smargoImg,
    link: "https://smargo.vercel.app",
  },
  {
    title: "Carol’s Smart Grocery App",
    type: "UI/UX Design Project",
    problem:
      "Designed a smart grocery shopping experience to improve user convenience and digital ordering flow.",
    solution:
      "Created a full UI/UX design system with user flows, wireframes and interactive prototype in Figma.",
    tools: ["Figma", "UX Design", "Prototyping"],
    outcome: "Complete mobile app design prototype showcasing modern grocery shopping experience.",
    accent: "linear-gradient(135deg, #4a2d5f, #1a0f2a)",
    image: carolgroceryImg,
    link: "https://www.figma.com/proto/2DaNeg6c0ujjkAvPKUCtOt/Carol-s-Smart-App-Project?node-id=8-107&t=5xigjoMiqZYb2100-1",
  },
  {
    title: "AI Customer Assistant - Demo",
    type: "React + AI Project",
    problem:
      "Service businesses repeat the same 20 questions all day - pricing, hours, location, booking.",
    solution:
      "Embeddable chat widget powered by an LLM, trained on a business FAQ, with email and Calendly handoff.",
    tools: ["React", "OpenAI API", "Node.js", "TypeScript"],
    outcome:
      "Working demo answers 80% of common questions instantly. Deployable to any site in minutes.",
    accent: "linear-gradient(135deg, #4a2d5f, #1a0f2a)",
    image: aireactImg,
  },
];
const steps = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "Free 30-min call to understand your goals and constraints.",
  },
  {
    num: "02",
    title: "Proposal",
    desc: "Clear scope, timeline and pricing - sent within 48 hours.",
  },
  {
    num: "03",
    title: "Design & Build",
    desc: "Iterative design and development with regular async updates and check-ins.",
  },
  { num: "04", title: "Revisions", desc: "Two rounds of revisions included on every package." },
  {
    num: "05",
    title: "Final Delivery",
    desc: "Launch, training and a clean handoff with all assets.",
  },
  {
    num: "06",
    title: "Support",
    desc: "30 days of post-launch support included on every project.",
  },
];

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/hello-kavaro";

function Home() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [hoveredSvc, setHoveredSvc] = useState<number | null>(null);

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            <p>Remote Digital Agency · Built in Nairobi</p>
          </div>
          <h1>
            A Remote Digital Agency Building <em>Websites</em> &amp; Digital Tools
          </h1>
          <p>
            Kavaro is a remote agency for growing businesses - landing pages, business websites,
            booking systems, dashboards and AI-enhanced features. Designed by a trained product
            designer, built with modern tools, shipped honestly.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/services" className="btn-primary">
              Explore Services
            </Link>
            <button className="btn-secondary" onClick={() => setCalendlyOpen(true)}>
              Book a Call
            </button>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.statsGrid}>
            {stats.map((s) => (
              <div className={styles.statCard} key={s.label}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {typeof window !== "undefined" && (
        <PopupModal
          url={CALENDLY_URL}
          onModalClose={() => setCalendlyOpen(false)}
          open={calendlyOpen}
          rootElement={document.body}
        />
      )}
      <div className={styles.techStrip}>
        <span className={styles.techLabel}>Built with</span>
        <div className={styles.techList}>
          {techStack.map((t) => (
            <span key={t} className={styles.techItem}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <section className={styles.vmSec}>
        <div className={styles.vmImageWrap}>
          <img
            src={founderImg}
            alt="Founder of Kavaro Agency"
            className={styles.vmImage}
            loading="lazy"
          />
          <div className={styles.vmFounder}>
            <strong>Kavaro</strong>
            <span>Founder · Creative Director · Product Designer</span>
          </div>
        </div>
        <div className={styles.vmCards}>
          <div className="section-label">About Kavaro</div>
          <h2 className={styles.storyH}>
            This Started With <em>Our Founder's Dad</em>.
          </h2>
          <p className={styles.storyP}>
            Our founder's father was a dialysis patient. For years she watched him travel to the hospital just to book a session, ask a question, get a refill, or confirm a result. Things a simple website or booking page could have handled in seconds. The clinic had no online presence. The pharmacy had no online presence. Most of the services he depended on had no digital front door at all.
          </p>
          <p className={styles.storyP}>
            He has since passed on, but the gap he lived with every day is still here. It's still hurting families like ours. So many local businesses, clinics, pharmacies, schools and small service providers, are invisible online, and the people who need them suffer for it. Kavaro exists in his memory, to change that one honest website at a time.
          </p>
          <p className={styles.storyP}>
          </p>
          <p className={styles.storyP}>
            We combine design thinking, modern engineering and practical AI capabilities to build digital products that genuinely work for the businesses and people using them.
          </p>
