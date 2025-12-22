import { User } from "@/dto/userDto";
import ApiClient from "@/lib/api-clients";
import Cookies from "js-cookie";

export const GetAllUsers = async (): Promise<User[]> => {
  try {
    const accessToken = Cookies.get("api_token");

    if (!accessToken) {
      throw new Error("No access token in cookies");
    }

    const res = await ApiClient.get<User[]>("/users/", {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data ?? [];
  } catch (error) {
    console.error("GetAllUsers error:", error);
    throw error;
  }
};

export const ChangePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<string> => {
  try {
    const accessToken = Cookies.get("api_token");

    if (!accessToken) {
      throw new Error("No access token in cookies");
    }

    const res = await ApiClient.put<{
      message: string;
    }>("/users/me/password", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });
    console.log(res)

    return res.data.message;
  } catch (err: any) {
    console.error("ChangePassword error:", err);
    const msg =
      err?.message ||
      "ไม่สามารถเปลี่ยนรหัสผ่านได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
    throw new Error(msg);
  }
};
