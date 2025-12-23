import type { User } from "@/dto/userDto";
import { clientFetch } from "@/lib/client-api";

export async function GetAllUsers(): Promise<User[]> {
  const r = await clientFetch<User[]>("/api/users", { cache: "no-store" });

  if (!r.success) {
    console.error("GetAllUsers error:", r.message);
    return [];
  }
  return r.data ?? [];
}

export async function ChangePassword(
  currentPassword: string,
  newPassword: string
): Promise<string> {
  const r = await clientFetch<{ message: string }>("/api/users/change-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (!r.success) {
    const msg = r.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
    throw new Error(msg);
  }

  return r.data?.message ?? "เปลี่ยนรหัสผ่านสำเร็จ";
}
