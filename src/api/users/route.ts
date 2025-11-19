import { AuthMeResponse, AuthUser, User } from "@/dto/userDto";
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

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  try {
    const res = await ApiClient.get<AuthMeResponse>("/api/auth/me", {
      withCredentials: true,
    });

    if (res.status < 200 || res.status >= 300) {
      throw new Error(
        `fetchCurrentUser failed: ${res.status} ${res.statusText}`
      );
    }

    const data = res.data;

    if (!data.authenticated || !data.user) {
      throw new Error(data.message ?? "Unauthenticated");
    }

    return data.user;
  } catch (error: any) {
    console.error("fetchCurrentUser error:", error);
    throw error;
  }
};
