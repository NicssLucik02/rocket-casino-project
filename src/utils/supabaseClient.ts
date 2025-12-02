import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nldykegcluiphorglzql.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZHlrZWdjbHVpcGhvcmdsenFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODExMzYsImV4cCI6MjA3OTc1NzEzNn0.0cEHVVwoRFm5Wod-Vikals3wtC6HDrJ-_i00BhHG9LA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
