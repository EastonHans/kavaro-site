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
    desc: "Modern, AI-ready websites and platforms — landing pages, booking flows and dashboards built with care.",
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
    desc: "Interfaces designed by a trained product designer — clear flows, real research, no fluff.",
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
      { title: "Kavaro Agency — Digital Product & Web Development Agency" },

      {
        name: "description",
        content:
          "Kavaro is a remote digital agency specializing in UI/UX design, web development, and AI-powered digital solutions for modern businesses.",
      },

      {
        property: "og:title",
        content: "Kavaro Agency — Digital Product & Web Development Agency",
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
  { num: "100%", label: "Remote · Worldwide" },
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
    desc: "Every project is shaped by our combined skills in UI/UX design, development, and product thinking — not templates or shortcuts.",
  },
  {
    title: "Hands-On Collaboration",
    desc: "Clients work directly with our team — designers and developers — ensuring clear communication and fast execution without unnecessary layers.",
  },
  {
    title: "Remote-First Agency",
    desc: "We operate as a distributed team, collaborating online across tools and timezones to deliver projects efficiently and consistently.",
  },
  {
    title: "AI-Ready Builds",
    desc: "Our team integrates modern AI capabilities into products — from chat systems to automation and smart workflows — where they actually add value.",
  },
];

const projects = [
  {
    title: "Healthcare Booking — Concept",
    type: "Concept Website",
    problem:
      "Local clinics in Nairobi rely on phone calls for appointments — patients wait, lines drop, no-shows are high.",
    solution:
      "A clean booking site with doctor profiles, time-slot picker, SMS reminders and a simple admin view.",
    tools: ["Figma", "React", "Tailwind", "Supabase"],
    outcome:
      "Concept prototype reduces booking friction to 3 taps. Designed mobile-first for low-bandwidth use.",
    accent: "linear-gradient(135deg, #1e3a5f, #0a1929)",
    image: splashscreeImg,
  },
  {
    title: "Smargo — Farm-to-Institution Marketplace",
    type: "Web Development Project",
    problem:
      "Farmers often rely on middlemen who reduce their earnings, while institutions like schools and hospitals struggle to access fresh produce directly from reliable suppliers.",
    solution:
      "Built a responsive marketplace interface that connects farmers directly with institutions, focusing on clarity, usability, and smooth product browsing and ordering flow.",
    tools: ["React", "TypeScript", "Vercel", "Frontend Development"],
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
    title: "AI Customer Assistant — Demo",
    type: "React + AI Project",
    problem:
      "Service businesses repeat the same 20 questions all day — pricing, hours, location, booking.",
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
    desc: "Clear scope, timeline and pricing — sent within 48 hours.",
  },
  {
    num: "03",
    title: "Design & Build",
    desc: "Iterative design and development with weekly check-ins.",
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
            <p>Fast-Growing Digital Agency · Remote · Nairobi</p>
          </div>
          <h1>
            A Fast-Growing Digital Agency Building <em>Websites</em> &amp; Digital Tools
          </h1>
          <p>
            Kavaro is an emerging remote agency for growing businesses — landing pages, business
            websites, booking systems, dashboards and AI-enhanced features. Designed by a trained
            product designer, built with modern tools, shipped honestly.
          </p>
          <div className={styles.heroBtns}>
            <button className="btn-primary" onClick={() => setCalendlyOpen(true)}>
              Book a Call
            </button>
            <Link to="/services" className="btn-secondary">
              Explore Services
            </Link>
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
            This Started With <em>My Dad</em>.
          </h2>
          <p className={styles.storyP}>
            My father was a dialysis patient. For years I watched him travel to the hospital just to
            book a session, ask a question, get a refill, or confirm a result things a simple
            website or booking page could have handled in seconds. The clinic had no online
            presence. The pharmacy had no online presence. Most of the services he depended on had
            no digital front door at all.
          </p>
          <p className={styles.storyP}>
            He has since passed on, but the gap he lived with every day is still here and it's still
            hurting families like ours. So many local businesses clinics, pharmacies, schools, small
            service providers are invisible online, and the people who need them suffer for it.
            Kavaro exists in his memory, to change that one honest website at a time.
          </p>
          <p className={styles.storyP}>
            I’m a UI/UX Product Designer and Creative Director at Kavaro, currently studying
            Software Engineering at Moringa School. I work across JavaScript, React, Python and
            Node.js building modern web systems with a strong focus on usability and performance.
          </p>

          <p className={styles.storyP}>
            My background includes foundational training in Cybersecurity, giving me a strong
            understanding of secure system thinking. I am also a certified UI/UX Designer, having
            graduated from Moringa School's intensive Bootcamp , where I developed skills in
            user-centered design, wireframing, prototyping, and creating intuitive digital
            experiences. Additionally, I hold a certification in Generative AI Essentials, which
            strengthens how I approach AI-powered product features and automation.
          </p>

          <p className={styles.storyP}>
            At Kavaro, we combine design thinking, engineering, and emerging AI capabilities to
            build practical digital products for real-world businesses.
          </p>
          <div className={styles.vmCard}>
            <h3>Our Vision</h3>
            <p>
              A world where every growing business — from a Nairobi clinic to a remote-first startup
              — has a digital experience that genuinely works for the people using it.
            </p>
          </div>
          <div className={styles.vmCard}>
            <h3>Our Mission</h3>
            <p>
              Design and build modern websites and digital tools that help growing businesses serve
              their customers better — combining product-design thinking with hands-on engineering.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.teamSec}>
        <div className="section-label">The Team</div>
        <h2 className={styles.secH}>
          Small Agency. <em>Focused Execution.</em>
        </h2>

        <p className={styles.secSub}>
          Kavaro is a remote digital agency of UI/UX designers and full-stack developers building
          modern digital products through design and code. We grow intentionally — through real
          projects, collaboration, and continuous learning.
        </p>
        <div className={styles.teamGrid}>
          {[
            {
              name: "Caroline Nyawira",
              role: "Founder ·Creative Director",
              bio: "Founder of Kavaro Agency. Specializes in web development, AI-powered features, UI/UX design and graphic design.",
              image: carolineImg,
            },
            {
              name: "Hezron Sande",
              role: "Graphic Designer · Web Developer",
              bio: "Works on graphic design, modern web experiences and UI/UX-focused digital products.",
              image: hezronImg,
            },
            {
              name: "Easton Hans",
              role: "Web Developer · UI/UX Designer",
              bio: "Focused on frontend development and building clean, user-friendly digital interfaces.",
              image: eastonImg,
            },
            {
              name: "Brenda Chebet",
              role: "Web Developer · UI/UX Designer",
              bio: "Passionate about modern web development and intuitive UI/UX experiences for businesses.",
              image: brendaImg,
            },
          ].map((m) => (
            <div key={m.name} className={styles.teamCard}>
              <div className={styles.teamAvatar}>
                <img src={m.image} alt={m.name} className={styles.teamImg} loading="lazy" />
              </div>

              <h4>{m.name}</h4>
              <span className={styles.teamRole}>{m.role}</span>
              <p>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.industriesSec}>
        <div className="section-label">Who We Serve</div>
        <h2 className={styles.secH}>
          Built for Businesses That <em>Serve People</em>
        </h2>
        <p className={styles.secSub}>
          Small and growing businesses — from local clinics to remote-first startups. If your
          customers need to find, book or buy from you, we can help.
        </p>
        <div className={styles.indGrid}>
          {industries.map((i) => (
            <div className={styles.indCard} key={i.name}>
              <div className={styles.indIcon}>{i.icon}</div>
              <h4>{i.name}</h4>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className="section-label">What We Do</div>
        <h2 className={styles.secH}>What Kavaro Can Build for You Today</h2>
        <p className={styles.secSub}>
          Real, commercially-useful work at the agency's current stage — websites, booking systems,
          dashboards, CRUD apps, AI-enhanced features and brand systems.
        </p>
        <div className={styles.svcGrid}>
          {services.map((s, i) => (
            <div
              key={s.num}
              className={`${styles.svcCard} ${hoveredSvc === i ? styles.svcHovered : ""}`}
              onMouseEnter={() => setHoveredSvc(i)}
              onMouseLeave={() => setHoveredSvc(null)}
            >
              <div className={styles.svcNum}>{s.num}</div>
              <h3 className={styles.svcTitle}>{s.title}</h3>
              <p className={styles.svcDesc}>{s.desc}</p>
              <span className={styles.svcTag}>{s.tag}</span>

              <div className={styles.svcActions}>
                <Link
                  to="/services"
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: "10px 18px" }}
                >
                  Enquire
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/services" className="btn-navy">
            View All Services & Pricing →
          </Link>
        </div>
      </section>
      {/* SAMPLE / CONCEPT PROJECTS — replaces fake testimonials */}
      <section className={styles.projSec}>
        <div className="section-label">Sample Work</div>
        <h2 className={styles.secH}> Featured Concepts&amp; Case Studies</h2>
        <p className={styles.secSub}>
          We're currently building our portfolio through independent concept projects, brand
          redesigns, and UX case studies created by our team. These projects reflect the kind of
          digital experiences and solutions we are capable of building for future clients.
        </p>
        <div className={styles.projGrid}>
          {projects.map((p) => (
            <article className={styles.projCard} key={p.title}>
              <div className={styles.projHero} style={{ background: p.accent }}>
                <span className={styles.projType}>{p.type}</span>
              </div>
              <div className={styles.projBody}>
                {p.image && (
                  <div className={styles.projImageWrap}>
                    <img src={p.image} alt={p.title} className={styles.projImage} loading="lazy" />
                  </div>
                )}
                <h3 className={styles.projTitle}>{p.title}</h3>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Problem</span>
                  <p>{p.problem}</p>
                </div>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Solution</span>
                  <p>{p.solution}</p>
                </div>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Tools Used</span>
                  <div className={styles.projTools}>
                    {p.tools.map((t) => (
                      <span key={t} className={styles.projTool}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.projBlock}>
                  <span className={styles.projLabel}>Outcome</span>
                  <p>{p.outcome}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.projNote}>
          * These are concept and case-study projects designed to showcase Kavaro's approach. Real
          client work and testimonials will appear here as projects ship.
        </p>
      </section>

      {/* SKILLS — replaces "More Expertise Coming Soon" */}
      <section className={styles.skillsSec}>
        <div className={styles.skillsInner}>
          <div>
            <div className="section-label" style={{ color: "var(--gold)" }}>
              Skills &amp; Background
            </div>
            <h2 className={styles.comingH}>
              Where Design Meets Engineering,
              <br />
              <em>Built</em> as One Agency
            </h2>
            <p className={styles.comingDesc}>
              Kavaro is a product studio where UI/UX design and software engineering come together.
              We combine design thinking with modern development to build digital products that are
              both visually intentional and technically solid.
            </p>
            <div className={styles.ctags}>
              {skills.map((s) => (
                <div className={styles.ctag} key={s}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.notify}>
            <h3>Book a Free Discovery Call</h3>
            <p>
              Pick a 30-minute slot that works for you. We'll talk through your project, your goals
              and how Kavaro can help — no pressure, no hard sell.
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className={styles.calBtn}>
              📅 Schedule on Calendly →
            </a>
            <p style={{ marginTop: 16, fontSize: 12 }}>
              Or use the{" "}
              <Link to="/contact" style={{ color: "var(--gold)", textDecoration: "underline" }}>
                contact form
              </Link>{" "}
              if you'd rather write first.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.whySec}>
        <div className="section-label">Why Kavaro</div>
        <h2 className={styles.secH}>The Kavaro Difference</h2>
        <p className={styles.secSub}>
          A small remote studio focused on craft, honesty and the kind of attention bigger agencies
          can't give.
        </p>
        <div className={styles.whyGrid}>
          {whyUs.map((w) => (
            <div className={styles.whyCard} key={w.title}>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className="section-label">How We Work</div>
        <h2 className={styles.secH}>Our Process — A System You Can Trust</h2>
        <p className={styles.secSub}>
          Businesses trust systems. Here's exactly what working with Kavaro looks like, from first
          call to ongoing support.
        </p>
        <div className={styles.procSteps7}>
          {steps.map((s) => (
            <div className={styles.step} key={s.num}>
              <div className={styles.stepN}>{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSec}>
        <h2>
          Ready to Build Something <em>Real?</em>
        </h2>
        <p>
          Whether you're a clinic in Nairobi or a startup anywhere in the world — let's talk. 100%
          remote, 100% honest.
        </p>
        <div className={styles.ctaBtns}>
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="btn-primary">
            Book a Call
          </a>
          <Link to="/contact" className="btn-secondary">
            Send a Message
          </Link>
        </div>
      </section>
    </main>
  );
}
