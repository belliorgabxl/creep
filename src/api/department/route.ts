import { Department } from "@/dto/departmentDto";
import ApiClient from "@/lib/api-clients";
import Cookies from "js-cookie";

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const accessToken = Cookies.get("api_token");

    if (!accessToken) {
      throw new Error("No access token in cookies");
    }

    const res = await ApiClient.get<{
      data: Department[];
      message: string;
      success: boolean;
    }>("/departments/", {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data ?? [];
  } catch (error) {
    console.error("fetchDepartments error:", error);
    throw error;
  }
};
