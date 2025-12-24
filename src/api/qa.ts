import { clientFetch } from "@/lib/client-api";
import type {
  GetQaIndicatorsByYearRespond,
  GetQaIndicatorsCountsByYear,
  GetQaIndicatorsDetailsRespond,
  GetQaIndicatorsRespond,
  QaRequest,
} from "@/dto/qaDto";

export async function GetQaIndicatorsByYearFromApi(year: number): Promise<GetQaIndicatorsByYearRespond[]> {
  const r = await clientFetch<GetQaIndicatorsByYearRespond[]>(
    `/api/qa/indicators/year/${year}/all`,
    { cache: "no-store" }
  );
  return r.success ? (r.data ?? []) : [];
}

export async function GetQaIndicatorsDetailsFromApi(): Promise<GetQaIndicatorsDetailsRespond[]> {
  const r = await clientFetch<GetQaIndicatorsDetailsRespond[]>(
    "/api/qa/indicators/details",
    { cache: "no-store" }
  );
  return r.success ? (r.data ?? []) : [];
}

export async function GetQaIndicatorsCountsByYearFromApi(): Promise<GetQaIndicatorsCountsByYear[]> {
  const r = await clientFetch<GetQaIndicatorsCountsByYear[]>(
    "/api/qa/indicators/counts-by-year",
    { cache: "no-store" }
  );
  return r.success ? (r.data ?? []) : [];
}

export async function GetQaIndicatorsDetailByIdApi(id: string): Promise<GetQaIndicatorsRespond[]> {
  const r = await clientFetch<GetQaIndicatorsRespond[]>(
    `/api/qa/indicators/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );
  return r.success ? (r.data ?? []) : [];
}

export async function UpdateQaDetailFromApi(id: string, payload: Partial<QaRequest>): Promise<boolean> {
  const r = await clientFetch<boolean>(`/api/qa/indicators/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.success ? Boolean(r.data) : false;
}

export async function CreateQaFromApi(payload: QaRequest): Promise<boolean> {
  const r = await clientFetch<boolean>("/api/qa/indicators", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.success ? Boolean(r.data) : false;
}

export async function DeleteQaFromApi(id: string): Promise<boolean> {
  const r = await clientFetch<boolean>(`/api/qa/indicators/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return r.success ? Boolean(r.data) : false;
}
