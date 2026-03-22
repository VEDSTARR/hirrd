import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabaseClient = async (supabaseAccessToken) => {
  const options = {};
  if (supabaseAccessToken) {
    options.global = {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    };
  }
  return createClient(supabaseUrl, supabaseKey, options);
};

export default supabaseClient;
