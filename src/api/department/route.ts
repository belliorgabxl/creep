import { Department } from "@/dto/departmentDto";
import ApiClient from "@/lib/api-clients";

interface DepartmentsResponse {
  data: Department[];
  message: string;
  success: boolean;
}

export const fetchDepartments = async (
  accessToken: string
): Promise<Department[]> => {
  try {
    const res = await ApiClient.get<DepartmentsResponse>("api/v1/departments", {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data;
  } catch (error) {
    console.error("fetchDepartments error:", error);
    throw error;
  }
};
