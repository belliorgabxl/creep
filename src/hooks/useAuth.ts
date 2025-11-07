"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบ auth status
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    // ตรวจสอบว่ามี token หรือไม่
    const hasToken = document.cookie
      .split("; ")
      .some((c) => c.startsWith("auth_token="));

    if (!hasToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    // ดึง role จาก cookie
    const roleMatch = document.cookie
      .split("; ")
      .find((c) => c.startsWith("user_role="));
    const role = roleMatch ? roleMatch.split("=")[1] : null;

    if (role) {
      // TODO: เรียก API เพื่อดึงข้อมูล user เต็ม
      // สำหรับตอนนี้ใช้ข้อมูลจาก cookie
      setUser({
        id: "1", // ควรดึงจาก API
        username: "user",
        name: "User",
        role: role,
      });
    }

    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isUser,
    logout,
    checkAuth,
  };
}