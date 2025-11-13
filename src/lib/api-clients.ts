import axios from "axios";

const ApiCentralizeBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const ApiClient = axios.create({
  baseURL: ApiCentralizeBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default ApiClient;
