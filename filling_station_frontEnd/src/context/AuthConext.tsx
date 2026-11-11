
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getMyDetails } from "../services/AuthService";
import api from "../services/Api";
import { clearRefreshToken } from "../services/settingService";

export type UserRole = "admin" | "customer" | "owner";

export interface User {
  _id?: string;
  username: string;
  email: string;
  userRole: UserRole;
  
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  previewImage:string | null
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderTypes = {
  children: ReactNode;
};

const isValidRole = (role: unknown): role is UserRole =>
  role === "admin" || role === "customer" || role === "owner";

export const AuthProvider = ({ children }: AuthProviderTypes) => {
  const [user, setUser] = useState<User | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAuthentication = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // No access token means user is not logged in.
      if (!accessToken) {
        setUser(null);
        return;
      }

      let response;

      try {
        response = await getMyDetails();

      } catch (error: any) {

        if (error.response?.status !== 401) {
          throw error;
        }

        // Access token expired. Try refreshing.
        const refreshResponse = await api.post("/newAccessToken");

        const newToken = refreshResponse.data.token;

        if (!newToken) {
          throw new Error("Unable to refresh token");
        }

        localStorage.setItem("accessToken", newToken);

        response = await getMyDetails();
      }

      const myDetails = response.data.myDetails;

      if (myDetails && isValidRole(myDetails.userRole)) {
        setUser(myDetails);
        setPreviewImage(response.data.image);
      } else {
        setUser(null);
        localStorage.removeItem("accessToken");
      }

    } catch (error) {
      console.error("Authentication check failed:", error);

      setUser(null);
      setPreviewImage(null);
      localStorage.removeItem("accessToken");

    } finally {
      setLoading(false);
    }
  };

  checkAuthentication();
}, []);

   const logout = async () => {
  try {
    setLoading(true);

    await clearRefreshToken();

    setUser(null);
    setPreviewImage(null);

    localStorage.removeItem("accessToken");

  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, logout,previewImage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
