import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
    process.env.REACT_APP_SUPABASE_URL;

const supabasePublishableKey =
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
    console.error(
        "❌ REACT_APP_SUPABASE_URL is missing."
    );
}

if (!supabasePublishableKey) {
    console.error(
        "❌ REACT_APP_SUPABASE_PUBLISHABLE_KEY is missing."
    );
}

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
);

export default supabase;