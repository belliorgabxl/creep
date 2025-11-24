import {   CreateUserRequest, UpdateUserRequest, UpdateUserStatusRequest, User } from "@/dto/userDto";
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


export async function CreateUserFromApi(
  payload: CreateUserRequest
): Promise<{ ok: boolean; status: number; data?: any; message?: string }> {
  const token = Cookies.get("api_token");
  if (!token) {
    console.warn("No token found in cookies.");
    return { ok: false, status: 0, message: "No auth token" };
  }

  try {
    const response = await ApiClient.post<{
      responseCode?: string;
      responseMessage?: string;
      data?: any;
    }>("users", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const body = response?.data;
    // server 2xx but application-level failure
    if (body?.responseCode && body.responseCode !== "00") {
      return { ok: false, status: response.status, data: body, message: body.responseMessage || "API returned error" };
    }

    return { ok: true, status: response.status, data: body?.data ?? body };
  } catch (err: any) {
    // axios error handling
    if (err?.response) {
      // server responded with status code outside 2xx
      return {
        ok: false,
        status: err.response.status,
        data: err.response.data,
        message: err.response.data?.message || err.response.data?.responseMessage || `Server error ${err.response.status}`,
      };
    } else if (err?.request) {
      // request made but no response
      return { ok: false, status: 0, message: "No response from server", data: null };
    } else {
      // something else
      return { ok: false, status: 0, message: err.message || "Unknown error", data: null };
    }
  }
}

export async function UpdateUserStatusFromApi(
  payload: UpdateUserStatusRequest
): Promise<boolean> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return false;
    }

    try {
        const response = await ApiClient.patch<{
            responseCode?: string;
            responseMessage?: string;
            data?: boolean;
        }>(`users/status`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const body = response?.data;
        if (!body) {
            console.error("Empty response body when updating User Status");
            return false;
        }
        if (body.responseCode && body.responseCode !== "00") {
            console.error("API returned failure responseCode:", body.responseCode, body.responseMessage);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error updating User Status:", err);
        return false;
    }
}


export async function UpdateUserFromApi(
  payload: UpdateUserRequest
): Promise<boolean> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return false;
    }

    try {
        const response = await ApiClient.patch<{
            responseCode?: string;
            responseMessage?: string;
            data?: boolean;
        }>(`users/details`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const body = response?.data;
        if (!body) {
            console.error("Empty response body when updating User detail");
            return false;
        }
        if (body.responseCode && body.responseCode !== "00") {
            console.error("API returned failure responseCode:", body.responseCode, body.responseMessage);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error updating QA indicator detail:", err);
        return false;
    }
}

