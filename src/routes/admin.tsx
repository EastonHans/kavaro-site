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
};

// Simple in-memory storage for demo (replace with real DB in production)
const DEFAULT_LEADS: Lead[] = [];
const DEFAULT_NOTES: Note[] = [];

const ADMIN_PASSWORD = "hello@kavaro";

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
  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "notes">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const storedLeads = localStorage.getItem("kavaro_leads");
    const storedNotes = localStorage.getItem("kavaro_notes");
    const storedBookedCalls = localStorage.getItem("kavaro_booked_calls");

    if (storedLeads) {
      try {
        setLeads(JSON.parse(storedLeads));
      } catch {
        // Invalid JSON, use default
      }
    }

    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch {
        // Invalid JSON, use default
      }
    }

    if (storedBookedCalls) {
      try {
        setBookedCalls(JSON.parse(storedBookedCalls));
      } catch {
        // Invalid JSON, use default
      }
    }
  }, [isAuthenticated]);

  // Save leads to localStorage whenever they change
  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("kavaro_leads", JSON.stringify(leads));
  }, [leads, isAuthenticated]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("kavaro_notes", JSON.stringify(notes));
  }, [notes, isAuthenticated]);

  // Save booked calls to localStorage whenever they change
  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("kavaro_booked_calls", JSON.stringify(bookedCalls));
  }, [bookedCalls, isAuthenticated]);

  const calendlyUrl =
    import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/hello-kavaro";

  const stats = {
    totalLeads: leads.length,
    sentEmails: leads.filter((l) => l.emailSent).length,
    newLeads: leads.filter((l) => l.status === "new").length,
    readLeads: leads.filter((l) => l.status === "read").length,
    repliedLeads: leads.filter((l) => l.status === "replied").length,
    bookedCalls: bookedCalls.length,
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      (lead.service && lead.service.toLowerCase().includes(query))
    );
  });

  function handleMarkRead(id: string) {
    setLeads(
      leads.map((l) =>
        l.id === id ? { ...l, status: "read" as const } : l,
      ),
    );
  }

  function handleMarkReplied(id: string) {
    setLeads(
      leads.map((l) =>
        l.id === id ? { ...l, status: "replied" as const } : l,
      ),
    );
  }

  function handleDeleteLead(id: string) {
    setLeads(leads.filter((l) => l.id !== id));
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
          <p>Manage inquiries and project notes</p>
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
          Inbox ({stats.newLeads})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "notes" ? styles.active : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Leads</div>
              <div className={styles.statValue}>{stats.totalLeads}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>New</div>
              <div className={styles.statValue}>{stats.newLeads}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Read</div>
              <div className={styles.statValue}>{stats.readLeads}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Replied</div>
              <div className={styles.statValue}>{stats.repliedLeads}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Sent Emails</div>
              <div className={styles.statValue}>{stats.sentEmails}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Booked Calls</div>
              <div className={styles.statValue}>{stats.bookedCalls}</div>
            </div>
          </div>

          <div className={styles.recentLeads}>
            <h2>Recent Inquiries</h2>
            {leads.length === 0 ? (
              <p className={styles.emptyState}>No inquiries yet</p>
            ) : (
              <div className={styles.leadsList}>
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className={`${styles.leadItem} ${styles[lead.status]}`}>
                    <div>
                      <strong>{lead.name}</strong>
                      <p>{lead.email}</p>
                      {lead.service && <span className={styles.service}>{lead.service}</span>}
                    </div>
                    <div className={styles.date}>{lead.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.calendarOverview}>
            <h2>Calendly Schedule</h2>
            <p>
              View the live booking schedule and all discovery call requests.
            </p>
            <a href={calendlyUrl} target="_blank" rel="noreferrer" className={styles.scheduleLink}>
              Open Calendly Schedule
            </a>
            {bookedCalls.length > 0 && (
              <div className={styles.bookedCalls}>
                <h3>Recent Booked Calls</h3>
                <ul>
                  {bookedCalls.slice(-5).reverse().map((call) => (
                    <li key={call.id}>
                      {call.date}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INBOX TAB */}
      {activeTab === "inbox" && (
        <div className={styles.content}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by name, email, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredLeads.length === 0 ? (
            <p className={styles.emptyState}>
              {searchQuery ? "No matching inquiries" : "No inquiries yet"}
            </p>
          ) : (
            <div className={styles.inboxList}>
              {filteredLeads.map((lead) => (
                <div key={lead.id} className={`${styles.inboxCard} ${styles[lead.status]}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3>{lead.name}</h3>
                      <p className={styles.email}>{lead.email}</p>
                    </div>
                    <div className={styles.statusBadge}>{lead.status}</div>
                  </div>

                  {lead.phone && (
                    <p className={styles.detail}>
                      <strong>Phone:</strong> {lead.phone}
                    </p>
                  )}

                  {lead.service && (
                    <p className={styles.detail}>
                      <strong>Service:</strong> {lead.service}
                    </p>
                  )}

                  <p className={styles.message}>
                    <strong>Message:</strong>
                    <br />
                    {lead.message}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.date}>{lead.date}</span>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
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
