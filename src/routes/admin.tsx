import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { supabase, type DbLead, type DbNote, type DbBookedCall } from "@/lib/supabase";
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

const CALENDLY_ADMIN_URL = "https://calendly.com/app/scheduled_events";

// Map DB row -> UI shape
function mapLead(row: DbLead) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    service: row.service ?? undefined,
    message: row.message,
    date: new Date(row.created_at).toLocaleDateString(),
    status: row.status,
    emailSent: row.email_sent,
  };
}

function mapNote(row: DbNote) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: new Date(row.created_at).toLocaleDateString(),
  };
}

function mapCall(row: DbBookedCall) {
  return {
    id: row.id,
    name: row.name ?? undefined,
    email: row.email ?? undefined,
    service: row.service ?? undefined,
    date: new Date(row.created_at).toLocaleString(),
    url: row.calendly_url,
  };
}

type Lead = ReturnType<typeof mapLead>;
type Note = ReturnType<typeof mapNote>;
type Call = ReturnType<typeof mapCall>;

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookedCalls, setBookedCalls] = useState<Call[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "notes" | "calls">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  // ── Check existing session on mount ────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load all data once authenticated ───────────────────────────────────────
  const loadData = useCallback(async () => {
    setDataLoading(true);
    const [leadsRes, notesRes, callsRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("notes").select("*").order("created_at", { ascending: false }),
      supabase.from("booked_calls").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data.map(mapLead));
    if (notesRes.data) setNotes(notesRes.data.map(mapNote));
    if (callsRes.data) setBookedCalls(callsRes.data.map(mapCall));
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("Incorrect email or password. Please try again.");
    } else {
      setEmail("");
      setPassword("");
    }
    setLoginLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  // ── Lead mutations ─────────────────────────────────────────────────────────
  async function handleMarkRead(id: string) {
    await supabase.from("leads").update({ status: "read" }).eq("id", id);
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: "read" as const } : l)));
  }

  async function handleMarkReplied(id: string) {
    await supabase.from("leads").update({ status: "replied" }).eq("id", id);
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: "replied" as const } : l)));
  }

  async function handleDeleteLead(id: string) {
    await supabase.from("leads").delete().eq("id", id);
    setLeads(leads.filter((l) => l.id !== id));
    if (expandedLead === id) setExpandedLead(null);
  }

  // ── Call mutations ─────────────────────────────────────────────────────────
  async function handleDeleteCall(id: string) {
    await supabase.from("booked_calls").delete().eq("id", id);
    setBookedCalls(bookedCalls.filter((c) => c.id !== id));
  }

  // ── Note mutations ─────────────────────────────────────────────────────────
  async function handleAddNote() {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }
    const { data, error } = await supabase
      .from("notes")
      .insert({ title: newNote.title.trim(), content: newNote.content.trim() })
      .select()
      .single();

    if (!error && data) {
      setNotes([mapNote(data as DbNote), ...notes]);
      setNewNote({ title: "", content: "" });
      setShowNewNoteForm(false);
    }
  }

  async function handleDeleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    setNotes(notes.filter((n) => n.id !== id));
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = {
    totalLeads: leads.length,
    sentEmails: leads.filter((l) => l.emailSent).length,
    newLeads: leads.filter((l) => l.status === "new").length,
    readLeads: leads.filter((l) => l.status === "read").length,
    repliedLeads: leads.filter((l) => l.status === "replied").length,
    bookedCalls: bookedCalls.length,
  };

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    const query = searchQuery.toLowerCase();
    return (
      !query ||
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.service && lead.service.toLowerCase().includes(query)) ||
      lead.message.toLowerCase().includes(query)
    );
  });

  // ── Loading state ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <main className={styles.admin}>
        <div className={styles.loginCard}>
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading...</p>
        </div>
      </main>
    );
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className={styles.admin}>
        <div className={styles.loginCard}>
          <h1>Admin Login</h1>
          <p>Sign in with your Kavaro admin account.</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label htmlFor="adminEmail">Email</label>
            <input
              id="adminEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@kavaroagency.com"
              autoFocus
              required
            />
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button type="submit" className={styles.btnSave} disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <main className={styles.admin}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Admin Dashboard</h1>
          <p>Manage inquiries, booked calls, and project notes</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
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

      {dataLoading ? (
        <div className={styles.content}>
          <p className={styles.emptyState}>Loading data...</p>
        </div>
      ) : (
        <>
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

              <div className={styles.recentLeads}>
                <div className={styles.sectionHeadRow}>
                  <h2>Recent Inquiries</h2>
                  {leads.length > 0 && (
                    <button className={styles.viewAll} onClick={() => setActiveTab("inbox")}>
                      View all
                    </button>
                  )}
                </div>
                {leads.length === 0 ? (
                  <p className={styles.emptyState}>No inquiries yet</p>
                ) : (
                  <div className={styles.leadsList}>
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className={`${styles.leadItem} ${styles[lead.status]}`}>
                        <div className={styles.leadItemLeft}>
                          <div className={styles.leadItemMeta}>
                            <strong>{lead.name}</strong>
                            <span className={`${styles.statusPill} ${styles[`pill_${lead.status}`]}`}>
                              {lead.status}
                            </span>
                            {lead.emailSent && (
                              <span className={styles.emailSentBadge}>email sent</span>
                            )}
                          </div>
                          <a href={`mailto:${lead.email}`} className={styles.leadEmail}>
                            {lead.email}
                          </a>
                          <div className={styles.leadTags}>
                            {lead.service && <span className={styles.service}>{lead.service}</span>}
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} className={styles.phoneTag}>
                                {lead.phone}
                              </a>
                            )}
                          </div>
                        </div>
                        <div className={styles.leadItemRight}>
                          <div className={styles.date}>{lead.date}</div>
                          <a
                            href={`mailto:${lead.email}?subject=Re: Your Kavaro Inquiry`}
                            className={styles.replyLink}
                          >
                            Reply
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.calendarOverview}>
                <div className={styles.calHeader}>
                  <div>
                    <h2>Calendly — Scheduled Events</h2>
                    <p>Open your Calendly dashboard to see all upcoming discovery calls.</p>
                  </div>
                  <a
                    href={CALENDLY_ADMIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.scheduleLink}
                  >
                    Open Calendly Dashboard
                  </a>
                </div>
                {bookedCalls.length > 0 && (
                  <div className={styles.bookedCallsPreview}>
                    <div className={styles.sectionHeadRow}>
                      <h3>Recent Site Bookings</h3>
                      <button className={styles.viewAll} onClick={() => setActiveTab("calls")}>
                        View all
                      </button>
                    </div>
                    <ul>
                      {bookedCalls.slice(0, 3).map((call) => (
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
                      {f === "all"
                        ? `All (${leads.length})`
                        : `${f} (${leads.filter((l) => l.status === f).length})`}
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
                                  {lead.phone}
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
                              <span className={styles.emailSentBadge}>email sent</span>
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
                                Reply by Email
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
                    Clients who clicked the Calendly link on your site. Open Calendly to confirm
                    actual scheduled times.
                  </p>
                </div>
                <a
                  href={CALENDLY_ADMIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.scheduleLink}
                >
                  Open Calendly Dashboard
                </a>
              </div>

              {bookedCalls.length === 0 ? (
                <p className={styles.emptyState}>No booked calls recorded yet</p>
              ) : (
                <div className={styles.callsList}>
                  {bookedCalls.map((call) => (
                    <div key={call.id} className={styles.callCard}>
                      <div className={styles.callCardLeft}>
                        <div className={styles.callAvatar}>
                          {(call.name || "?")[0].toUpperCase()}
                        </div>
                        <div className={styles.callInfo}>
                          <strong className={styles.callName}>{call.name || "Anonymous visitor"}</strong>
                          {call.email ? (
                            <a
                              href={`mailto:${call.email}?subject=Your Discovery Call — Kavaro`}
                              className={styles.callEmailLink}
                            >
                              {call.email}
                            </a>
                          ) : (
                            <span className={styles.callNoEmail}>No email captured</span>
                          )}
                          {call.service && <span className={styles.service}>{call.service}</span>}
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
        </>
      )}
    </main>
  );
}

export default AdminDashboard;
