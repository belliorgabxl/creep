import axios from "axios";

const AppClient = axios.create({
  baseURL: process.env.API_BASE_URL ??
    "https://e-budget-api.usefulapps.app/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export default AppClient;
