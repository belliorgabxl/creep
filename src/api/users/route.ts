import {   User } from "@/dto/userDto";
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

