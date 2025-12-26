// import { Department } from "@/dto/departmentDto";
// import { ProjectInformationResponse } from "@/dto/projectDto";
// import ApiClient from "@/lib/api-clients";
// import Cookies from "js-cookie";

// export const fetchDepartments = async (): Promise<Department[]> => {
//   try {
//     const accessToken = Cookies.get("api_token");

//     if (!accessToken) {
//       throw new Error("No access token in cookies");
//     }
//     console.log(accessToken)
//     const res = await ApiClient.get<{
//       data: Department[];
//       message: string;
//       success: boolean;
//     }>("/departments/", {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//         authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return res.data.data ?? [];
//   } catch (error) {
//     console.error("fetchDepartments error:", error);
//     throw error;
//   }
// };

// export async function GetDepartmentsDetailByIdApi(id: string): Promise<Department[]> {
//   const token = Cookies.get("api_token");
//   if (!token) {
//     console.warn("No token found in cookies.");
//     return [];
//   }

//   try {
//     const response = await ApiClient.get<{
//       responseCode?: string;
//       responseMessage?: string;
//       data?: Department | Department[];
//     }>(`/departments/detail/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     });

//     const body = response?.data;
//     if (!body) return [];

//     const payload = (body as any).data ?? body;

//     // กรณี array
//     if (Array.isArray(payload)) {
//       return payload as Department[];
//     }

//     // กรณี object เดียว
//     if (payload && typeof payload === "object") {
//       // ถ้า object มีฟิลด์ id (หรือโครงสร้างที่คาดไว้) ให้คืนเป็น array 1 รายการ
//       if ("id" in payload && typeof (payload as any).id === "string") {
//         return [payload as Department];
//       }
//       return [payload as Department];
//     }

//     return [];
//   } catch (err) {
//     console.error("Error fetching Departments details:", err);
//     return [];
//   }
// }