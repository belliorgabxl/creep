import axios from "axios";

const ApiCentralizeBaseUrl =
  process.env.NEXT_PUBLIC_API_CENTRALIZE_BASE_URL ??
  "http://localhost:3000/api";

const ApiClient = axios.create({
  baseURL: ApiCentralizeBaseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default ApiClient;
