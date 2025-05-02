import axios from "axios";
import Cookies from "universal-cookie";

export interface ConnectionPayload {
  host: string;
  user: string;
  password: string;
  database?: string;
  port: string;
}

export const connectToDatabase = async (payload: ConnectionPayload) => {
  try {
    const cookies = new Cookies();
    const getAccessToken = () => {
      const cookieKeys = Object.keys(cookies.getAll());
      const accessTokenKey = cookieKeys.find((key) =>
        key.endsWith("accessToken")
      );
      return accessTokenKey ? cookies.get(accessTokenKey) : null;
    };

    const accessToken = getAccessToken();

    const tenantId = cookies.get("workspaceId");

    if (!accessToken) {
      console.error("Missing access token. User must be logged in.");
      throw new Error("User must be logged in");
    }

    const response = await axios.post(
      "http://localhost:3006/database/connect",
      payload,
      {
        headers: {
          Authorization: accessToken,
          "x-tenant-id": tenantId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Error connecting to database");
  }
};
