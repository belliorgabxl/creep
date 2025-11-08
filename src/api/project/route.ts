"use server";
import ApiClient from "@/lib/api-centralize";
import { cookies } from "next/headers";

export const fetchGetAllProjects = async () => {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await ApiClient.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response || !response.data) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    console.error("[fetchGetAllProjects] Failed:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching projects",
      data: [],
    };
  }
};
