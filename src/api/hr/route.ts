import ApiClient from "@/lib/api-clients";
import type {GetUserRespond } from "@/dto/user";
import Cookies from "js-cookie";

export async function GetUserByOrgFromApi(): Promise<GetUserRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetUserRespond | GetUserRespond[];
        }>(`users/organization`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];

        if (Array.isArray(body)) {
            return body as GetUserRespond[];
        }
        if (Array.isArray(body?.data)) {
            return body.data as GetUserRespond[];
        }
        if (body?.data && typeof body.data === "object") {
            return [body.data] as GetUserRespond[];
        }
        return [];
    } catch (err) {
        console.error("Error fetching QA indicators:", err);
        return [];
    }
}

export async function GetUserByIdFromApi(id: string): Promise<GetUserRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }

    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetUserRespond | GetUserRespond[];
        }>(`users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;

        if (!body) return [];

        if (Array.isArray(body)) {
            return body as GetUserRespond[];
        }

        if (body?.data) {
            if (Array.isArray(body.data)) {
                return body.data as GetUserRespond[];
            }
            if (typeof body.data === "object" && body.data !== null) {
                return [body.data as GetUserRespond];
            }
        }

        if (typeof body === "object" && body !== null) {
            if ("id" in body && typeof (body as any).id === "string") {
                console.log("body is single object with id -> returning [body]");
                return [body as unknown as GetUserRespond];
            }
        }

        return [];
    } catch (err) {
        console.error("Error fetching QA indicators details:", err);
        return [];
    }
}