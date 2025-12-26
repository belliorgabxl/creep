type ApiOk<T> = { success: true; data: T };
type ApiFail = { success: false; message?: string };
export type ApiResult<T> = ApiOk<T> | ApiFail;

export async function clientFetch<T>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const res = await fetch(url, init);
  return res.json();
}
