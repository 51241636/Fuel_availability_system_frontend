
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getMyDetails } from "../services/AuthService";
import api from "../services/Api";

export type UserRole = "admin" | "driver" | "owner";

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
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderTypes = {
  children: ReactNode;
};

const isValidRole = (role: unknown): role is UserRole =>
  role === "admin" || role === "driver" || role === "owner";

export const AuthProvider = ({ children }: AuthProviderTypes) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        let accessToken = localStorage.getItem("accessToken");

        // Get a new access token if one is missing.
        if (!accessToken) {
          const response = await api.post("/newAccessToken");
          accessToken = response.data.token;

          if (!accessToken) {
            setUser(null);
            return;
          }

          localStorage.setItem("accessToken", accessToken);
        }

        // Validate the access token by requesting user details.
        let response;

        try {
          response = await getMyDetails();
        } catch (error: any) {
          // Retry once with a refreshed token if the access token expired.
          if (error.response?.status !== 401) {
            throw error;
          }

          const refreshResponse = await api.post("/newAccessToken");
          const newToken = refreshResponse.data.token;

          if (!newToken) {
            throw new Error("Unable to refresh access token");
          }

          localStorage.setItem("accessToken", newToken);
          response = await getMyDetails();
        }

        const myDetails = response?.data?.myDetails;

        if (myDetails && isValidRole(myDetails.userRole)) {
          setUser(myDetails);
        } else {
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, logout }}
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
