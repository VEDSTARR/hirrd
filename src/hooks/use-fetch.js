import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      let supabaseAccessToken = null;

      if (session) {
        try {
          supabaseAccessToken = await session.getToken({
            template: "supabase",
          });
        } catch {
          try {
            supabaseAccessToken = await session.getToken();
          } catch {
            supabaseAccessToken = null;
          }
        }
      }

      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
    } catch (err) {
      console.error("useFetch:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
