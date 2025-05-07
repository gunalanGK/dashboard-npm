import axios from "axios";
import useAuthStore from "../../store/authStore";
import Cookies from "universal-cookie";
import Config from "@/config";

const API_BASE_URL = Config.dynamicDashboardUrl;
;

const cookies = new Cookies();
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const getAccessToken = () => {
      const cookieKeys = Object.keys(cookies.getAll());
      const accessTokenKey = cookieKeys.find((key) =>
        key.endsWith("accessToken")
      );
      return accessTokenKey ? cookies.get(accessTokenKey) : null;
    };

    const accessToken = getAccessToken();

    const tenantId = cookies.get("workspaceId");

    if (accessToken) {
      config.headers["Authorization"] = accessToken;
    }

    if (tenantId) {
      config.headers["x-tenant-id"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchTableColumnDataTypes = async (selectedTables: string[]) => {
  if (selectedTables.length === 0) return null;

  const queryString = selectedTables
    .map((table) => `tables=${encodeURIComponent(table)}`)
    .join("&");

  try {
    const response = await apiClient.get(`/upload/plot-data?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch table column data types:", error);
    throw error;
  }
};

export const fetchDashboardTemplate = async (
  selectedTables: string[],
  templateName: string
) => {
  if (selectedTables.length === 0) return null;

  const queryString = selectedTables
    .map((table) => `tables=${encodeURIComponent(table)}`)
    .join("&");

  try {
    const response = await apiClient.get(
      `/upload/dashboard-template?${queryString}&templateName=${encodeURIComponent(
        templateName
      )}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch table column data types:", error);
    throw error;
  }
};

export const uploadCSVFiles = async (files: FileList) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await apiClient.post("/upload/csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export const fetchTableNames = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get("/upload/tables");
    return response.data;
  } catch (error: any) {
    console.error(
      "Error retrieving table names:",
      error.response?.data || error
    );
    throw new Error("Error retrieving table names");
  }
};

export const fetchTableData = async (tableName: string) => {
  try {
    const response = await apiClient.get(`/upload/table-data/${tableName}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving table data:", error);
    throw error;
  }
};
