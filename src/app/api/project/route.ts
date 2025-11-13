import Cookies from "js-cookie";
import ApiClient from "@/lib/api-clients";
import {GetProjectsByOrgRespond } from "@/api/model/project";

export const getProjectsByOrg = async (): Promise<GetProjectsByOrgRespond[]> => {
  const token = Cookies.get("api_token");
  if (!token) {
    console.warn("No token found in cookies.");
    return [];
  }

  try {
    const response = await ApiClient.get<{
      responseCode?: string;
      responseMessage?: string;
      data?: GetProjectsByOrgRespond | GetProjectsByOrgRespond[];
    }>("projects", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const body = response?.data;
    if (!body) return [];

    const payload = body.data;

    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    return [payload];
  } catch (err) {
    console.error("Error fetching projects by organization:", err);
    return [];
  }
};
