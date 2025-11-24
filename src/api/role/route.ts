import ApiClient from "@/lib/api-clients";
import Cookies from "js-cookie";
import { RoleRespond } from "@/dto/roleDto";

export async function GetRoleFromApi(): Promise<RoleRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: RoleRespond | RoleRespond[];
        }>(`roles`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];

        if (Array.isArray(body)) {
            return body as RoleRespond[];
        }
        if (Array.isArray(body?.data)) {
            return body.data as RoleRespond[];
        }
        if (body?.data && typeof body.data === "object") {
            return [body.data] as RoleRespond[];
        }
        return [];
    } catch (err) {
        console.error("Error fetching Role:", err);
        return [];
    }
}