import { createClient } from "@supabase/supabase-js";

// The anon key is intentionally public — it's designed to be exposed in
// client-side code. Supabase Row Level Security policies control data access.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://ppdqofwkwyqsfqikeaiv.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZHFvZndrd3lxc2ZxaWtlYWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwODAzMjAsImV4cCI6MjA5NzY1NjMyMH0.5FPQDQxAMhq-6iOCvhXy28POvYOHqmaSCsn0nWWGeZ8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types matching the database schema ──────────────────────────────────────

export type DbLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: "new" | "read" | "replied";
  email_sent: boolean;
  created_at: string;
};

export type DbNote = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export type DbBookedCall = {
  id: string;
  name: string | null;
  email: string | null;
  service: string | null;
  calendly_url: string;
  created_at: string;
};
