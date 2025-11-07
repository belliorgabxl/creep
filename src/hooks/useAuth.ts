"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: string; username: string; name: string; role: string;
  org_id?: string; department_id?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      if (!r.ok) { setUser(null); setLoading(false); return; }
      const j = await r.json();
      if (j?.authenticated) setUser(j.user);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login"); router.refresh();
  }, [router]);

  const isAdmin = user?.role === "admin";
  const isUser = !!user;

  return { user, loading, isAuthenticated: !!user, isAdmin, isUser, logout, refresh: fetchMe };
}
