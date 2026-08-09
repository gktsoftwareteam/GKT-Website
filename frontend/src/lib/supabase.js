import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
    throw new Error(
        "REACT_APP_SUPABASE_URL is missing. Check your .env file."
    );
}

if (!supabaseKey) {
    throw new Error(
        "REACT_APP_SUPABASE_PUBLISHABLE_KEY is missing. Check your .env file."
    );
}

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);