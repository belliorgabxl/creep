import { useEffect, useState } from "react";

export type Me = {
  sub: string;
  name: string;
  role: string;
  org_id: string;
  department_id?: string;
};

export function useAuth() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Me = await res.json();
        if (alive) setMe(data);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { me, loading, error };
}
