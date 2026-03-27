import { useState, useEffect } from "react";

interface AuthUser {
  role: "admin" | "reader";
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("readhub_auth");
    if (storedAuth) {
      setUser(JSON.parse(storedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === "admin@readhub.com" && password === "admin123") {
      const authUser: AuthUser = { role: "admin", email };
      localStorage.setItem("readhub_auth", JSON.stringify(authUser));
      setUser(authUser);
      return true;
    }
    if (email === "user@readhub.com" && password === "user123") {
      const authUser: AuthUser = { role: "reader", email };
      localStorage.setItem("readhub_auth", JSON.stringify(authUser));
      setUser(authUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("readhub_auth");
    setUser(null);
  };

  return { user, isLoading, login, logout };
}