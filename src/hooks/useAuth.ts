import { useState } from "react";
import amplifyService from "../services/aws/aws-services";
import axios from "axios";
import Cookies from "universal-cookie";
import useAuthStore from "../store/authStore";
import Config from "@/config";

const cookies = new Cookies();

interface LoginFormValues {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const navigate = useNavigate();
  
  const { setAccessToken, setTenantId } = useAuthStore();

  const login = async (values: LoginFormValues) => {
    try {
      const userSignedIn = await amplifyService.signIn({
        username: values.email,
        password: values.password,
      });

      if (userSignedIn.isSignedIn) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("name", "Test-User");
        localStorage.setItem("email", values.email);

        console.log("Successfully completed login");


        const getAccessToken = () => {
          const cookieKeys = Object.keys(cookies.getAll());
          const accessTokenKey = cookieKeys.find(key => key.endsWith("accessToken"));
          return accessTokenKey ? cookies.get(accessTokenKey) : null;
        };
        
        const accessToken = getAccessToken();

        if (accessToken) {
          console.log("Access Token:", accessToken);
          setAccessToken(accessToken); 

          const response = await axios.get(
            `${Config.apiUrl}validate-user`,
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );

          console.log("User validation API call successful:", response.data);
          const tenant_id = response?.data?.data?.defaultWorkspace?.id;
          console.log("x-tenant-id",tenant_id);
          if (tenant_id) {
            setTenantId(tenant_id);
            cookies.set("workspaceId",tenant_id);
          }

          localStorage.setItem("x-tenant-id", tenant_id);
        } else {
          console.warn("Access token not found in cookies.");
        }
       
        // navigate("/showconnection");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "An error occurred");
      localStorage.setItem("isAuthenticated", "false");
      console.error("Login error:", e);
    }
  };

  return { login, errorMessage};
};
