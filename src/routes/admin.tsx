import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import styles from "./Admin.module.css";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Kavaro" },
      { name: "description", content: "Manage leads and project notes." },
    ],
  }),
});

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
  emailSent: boolean;
};

type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type BookedCall = {
  id: string;
  date: string;
  url: string;
  name?: string;
  email?: string;
  service?: string;
};

const DEFAULT_LEADS: Lead[] = [];
const DEFAULT_NOTES: Note[] = [];

const ADMIN_PASSWORD = "hello@kavaro";

// Calendly admin dashboard — shows your scheduled events, not the public booking page
const CALENDLY_ADMIN_URL = "https://calendly.com/app/scheduled_events";

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    typeof window !== "undefined" &&
      sessionStorage.getItem("kavaro_admin_auth") === "true",
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(DEFAULT_LEADS);
  const [notes, setNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [bookedCalls, setBookedCalls] = useState<BookedCall[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "notes" | "calls">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const storedLeads = localStorage.getItem("kavaro_leads");
    const storedNotes = localStorage.getItem("kavaro_notes");
    const storedBookedCalls = localStorage.getItem("kavaro_booked_calls");

    if (storedLeads) {
      try { setLeads(JSON.parse(storedLeads)); } catch { /* ignore */ }
    }
    if (storedNotes) {
      try { setNotes(JSON.parse(storedNotes)); } catch { /* ignore */ }
    }
    if (storedBookedCalls) {
      try { setBookedCalls(JSON.parse(storedBookedCalls)); } catch { /* ignore */ }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("kavaro_leads", JSON.stringify(leads));
  }, [leads, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("kavaro_notes", JSON.stringify(notes));
  }, [notes, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("kavaro_booked_calls", JSON.stringify(bookedCalls));
  }, [bookedCalls, isAuthenticated]);

  const stats = {
    totalLeads: leads.length,
    sentEmails: leads.filter((l) => l.emailSent).length,
    newLeads: leads.filter((l) => l.status === "new").length,
    readLeads: leads.filter((l) => l.status === "read").length,
    repliedLeads: leads.filter((l) => l.status === "replied").length,
    bookedCalls: bookedCalls.length,
  };

  const filteredLeads = leads
    .filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      const query = searchQuery.toLowerCase();
      return (
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.service && lead.service.toLowerCase().includes(query)) ||
        lead.message.toLowerCase().includes(query)
      );
    })
    // newest first
    .sort((a, b) => Number(b.id) - Number(a.id));

  function handleMarkRead(id: string) {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: "read" as const } : l)));
  }

  function handleMarkReplied(id: string) {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: "replied" as const } : l)));
  }

  function handleDeleteLead(id: string) {
    setLeads(leads.filter((l) => l.id !== id));
    if (expandedLead === id) setExpandedLead(null);
  }

  function handleDeleteCall(id: string) {
    setBookedCalls(bookedCalls.filter((c) => c.id !== id));
  }

  function handleAddNote() {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toLocaleDateString(),
    };
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "" });
    setShowNewNoteForm(false);
  }

  function handleDeleteNote(id: string) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("kavaro_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError(null);
      setPassword("");
      return;
    }
    setLoginError("Incorrect password. Please try again.");
  }

  function handleLogout() {
    sessionStorage.removeItem("kavaro_admin_auth");
    setIsAuthenticated(false);
    navigate({ to: "/" });
  }

  if (!isAuthenticated) {
    return (
      <main className={styles.admin}>
        <div className={styles.loginCard}>
          <h1>Admin Login</h1>
          <p>Enter the password to access the dashboard.</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
            />
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button type="submit" className={styles.btnSave}>
              Unlock Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.admin}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Admin Dashboard</h1>
          <p>Manage inquiries, booked calls, and project notes</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ← Logout
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "overview" ? styles.active : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === "inbox" ? styles.active : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox {stats.newLeads > 0 && <span className={styles.tabBadge}>{stats.newLeads}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "calls" ? styles.active : ""}`}
          onClick={() => setActiveTab("calls")}
        >
          Booked Calls {stats.bookedCalls > 0 && <span className={styles.tabBadge}>{stats.bookedCalls}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "notes" ? styles.active : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Leads</div>
              <div className={styles.statValue}>{stats.totalLeads}</div>
            </div>
            <div className={`${styles.statCard} ${styles.statNew}`}>
              <div className={styles.statLabel}>New</div>
              <div className={styles.statValue}>{stats.newLeads}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Read</div>
              <div className={styles.statValue}>{stats.readLeads}</div>
            </div>
            <div className={`${styles.statCard} ${styles.statReplied}`}>
              <div className={styles.statLabel}>Replied</div>
              <div className={styles.statValue}>{stats.repliedLeads}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Emails Sent</div>
              <div className={styles.statValue}>{stats.sentEmails}</div>
            </div>
            <div className={`${styles.statCard} ${styles.statCalls}`}>
              <div className={styles.statLabel}>Booked Calls</div>
              <div className={styles.statValue}>{stats.bookedCalls}</div>
            </div>
          </div>

          {/* Recent inquiries — richer preview */}
          <div className={styles.recentLeads}>
            <div className={styles.sectionHeadRow}>
              <h2>Recent Inquiries</h2>
              {leads.length > 0 && (
                <button className={styles.viewAll} onClick={() => setActiveTab("inbox")}>
                  View all →
                </button>
              )}
            </div>
            {leads.length === 0 ? (
              <p className={styles.emptyState}>No inquiries yet</p>
            ) : (
              <div className={styles.leadsList}>
                {[...leads].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5).map((lead) => (
                  <div key={lead.id} className={`${styles.leadItem} ${styles[lead.status]}`}>
                    <div className={styles.leadItemLeft}>
                      <div className={styles.leadItemMeta}>
                        <strong>{lead.name}</strong>
                        <span className={`${styles.statusPill} ${styles[`pill_${lead.status}`]}`}>
                          {lead.status}
                        </span>
                        {lead.emailSent && (
                          <span className={styles.emailSentBadge}>✉ sent</span>
                        )}
                      </div>
                      <a href={`mailto:${lead.email}`} className={styles.leadEmail}>
                        {lead.email}
                      </a>
                      <div className={styles.leadTags}>
                        {lead.service && <span className={styles.service}>{lead.service}</span>}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className={styles.phoneTag}>
                            📞 {lead.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className={styles.leadItemRight}>
                      <div className={styles.date}>{lead.date}</div>
                      <a href={`mailto:${lead.email}?subject=Re: Your Kavaro Inquiry`} className={styles.replyLink}>
                        Reply →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendly section — links to YOUR admin dashboard, not the public booking page */}
          <div className={styles.calendarOverview}>
            <div className={styles.calHeader}>
              <div>
                <h2>Calendly — Scheduled Events</h2>
                <p>
                  Open your Calendly dashboard to see all upcoming and past discovery calls booked
                  by clients.
                </p>
              </div>
              <a
                href={CALENDLY_ADMIN_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.scheduleLink}
              >
                📅 Open My Calendly Dashboard
              </a>
            </div>

            {bookedCalls.length > 0 && (
              <div className={styles.bookedCallsPreview}>
                <div className={styles.sectionHeadRow}>
                  <h3>Recent Site Bookings</h3>
                  <button className={styles.viewAll} onClick={() => setActiveTab("calls")}>
                    View all →
                  </button>
                </div>
                <ul>
                  {[...bookedCalls].reverse().slice(0, 3).map((call) => (
                    <li key={call.id} className={styles.callPreviewItem}>
                      <div className={styles.callPreviewLeft}>
                        <strong>{call.name || "Anonymous"}</strong>
                        {call.email && (
                          <a href={`mailto:${call.email}`} className={styles.callEmail}>
                            {call.email}
                          </a>
                        )}
                        {call.service && <span className={styles.service}>{call.service}</span>}
                      </div>
                      <div className={styles.date}>{call.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INBOX TAB ── */}
      {activeTab === "inbox" && (
        <div className={styles.content}>
          <div className={styles.inboxControls}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, email, service, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.filterTabs}>
              {(["all", "new", "read", "replied"] as const).map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${statusFilter === f ? styles.filterActive : ""}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f === "all" ? `All (${leads.length})` : `${f} (${leads.filter((l) => l.status === f).length})`}
                </button>
              ))}
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <p className={styles.emptyState}>
              {searchQuery || statusFilter !== "all" ? "No matching inquiries" : "No inquiries yet"}
            </p>
          ) : (
            <div className={styles.inboxList}>
              {filteredLeads.map((lead) => {
                const isExpanded = expandedLead === lead.id;
                return (
                  <div key={lead.id} className={`${styles.inboxCard} ${styles[lead.status]}`}>
                    <div
                      className={styles.cardHeader}
                      onClick={() => setExpandedLead(isExpanded ? null : lead.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className={styles.cardHeaderLeft}>
                        <h3>{lead.name}</h3>
                        <div className={styles.cardMeta}>
                          <a
                            href={`mailto:${lead.email}`}
                            className={styles.email}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.email}
                          </a>
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className={styles.phoneLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              📞 {lead.phone}
                            </a>
                          )}
                        </div>
                        {lead.service && (
                          <span className={styles.service}>{lead.service}</span>
                        )}
                      </div>
                      <div className={styles.cardHeaderRight}>
                        <span className={`${styles.statusBadge} ${styles[`badge_${lead.status}`]}`}>
                          {lead.status}
                        </span>
                        {lead.emailSent && (
                          <span className={styles.emailSentBadge}>✉ email sent</span>
                        )}
                        <span className={styles.date}>{lead.date}</span>
                        <span className={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <>
                        <div className={styles.messageBlock}>
                          <span className={styles.messageLabel}>Message</span>
                          <p className={styles.messageText}>{lead.message}</p>
                        </div>

                        <div className={styles.cardFooter}>
                          <a
                            href={`mailto:${lead.email}?subject=Re: Your Kavaro Inquiry`}
                            className={`${styles.btn} ${styles.btnEmail}`}
                          >
                            ✉ Reply by Email
                          </a>
                          <div className={styles.actions}>
                            {lead.status === "new" && (
                              <button
                                className={`${styles.btn} ${styles.btnRead}`}
                                onClick={() => handleMarkRead(lead.id)}
                              >
                                Mark Read
                              </button>
                            )}
                            {lead.status !== "replied" && (
                              <button
                                className={`${styles.btn} ${styles.btnReplied}`}
                                onClick={() => handleMarkReplied(lead.id)}
                              >
                                Mark Replied
                              </button>
                            )}
                            <button
                              className={`${styles.btn} ${styles.btnDelete}`}
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── BOOKED CALLS TAB ── */}
      {activeTab === "calls" && (
        <div className={styles.content}>
          <div className={styles.callsHeader}>
            <div>
              <h2>Booked Discovery Calls</h2>
              <p className={styles.callsSubtitle}>
                These are clients who clicked the Calendly link on your site. Open your Calendly
                dashboard to confirm actual scheduled times.
              </p>
            </div>
            <a
              href={CALENDLY_ADMIN_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.scheduleLink}
            >
              📅 Open Calendly Dashboard
            </a>
          </div>

          {bookedCalls.length === 0 ? (
            <p className={styles.emptyState}>No booked calls recorded yet</p>
          ) : (
            <div className={styles.callsList}>
              {[...bookedCalls].reverse().map((call) => (
                <div key={call.id} className={styles.callCard}>
                  <div className={styles.callCardLeft}>
                    <div className={styles.callAvatar}>
                      {(call.name || "?")[0].toUpperCase()}
                    </div>
                    <div className={styles.callInfo}>
                      <strong className={styles.callName}>{call.name || "Anonymous visitor"}</strong>
                      {call.email ? (
                        <a href={`mailto:${call.email}?subject=Your Discovery Call — Kavaro`} className={styles.callEmailLink}>
                          {call.email}
                        </a>
                      ) : (
                        <span className={styles.callNoEmail}>No email captured</span>
                      )}
                      {call.service && (
                        <span className={styles.service}>{call.service}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.callCardRight}>
                    <span className={styles.callDate}>{call.date}</span>
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => handleDeleteCall(call.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── NOTES TAB ── */}
      {activeTab === "notes" && (
        <div className={styles.content}>
          <div className={styles.notesHeader}>
            <h2>Project Notes</h2>
            <button
              className={styles.btnNew}
              onClick={() => setShowNewNoteForm(!showNewNoteForm)}
            >
              {showNewNoteForm ? "Cancel" : "+ New Note"}
            </button>
          </div>

          {showNewNoteForm && (
            <div className={styles.noteForm}>
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className={styles.noteTitle}
              />
              <textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
              />
              <button className={styles.btnSave} onClick={handleAddNote}>
                Save Note
              </button>
            </div>
          )}

          {notes.length === 0 ? (
            <p className={styles.emptyState}>No notes yet</p>
          ) : (
            <div className={styles.notesList}>
              {notes.map((note) => (
                <div key={note.id} className={styles.noteCard}>
                  <div className={styles.noteHeader}>
                    <h3>{note.title}</h3>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p className={styles.noteContent}>{note.content}</p>
                  <p className={styles.noteDate}>{note.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default AdminDashboard;
