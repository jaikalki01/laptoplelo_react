import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name?: string;
  email?: string;
  role?: string;
  sub?: string;
  phone?: string;
  profilePic?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isAuthReady: boolean; // ✅ add this
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On load, get token and decode
 const [isAuthReady, setIsAuthReady] = useState(false);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setUser(payload);
      setToken(storedToken);
    } catch (err) {
      console.error("Invalid token");
    }
  }
  setIsAuthReady(true); // ✅ important
}, []);


  const login = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (e) {
      console.error("Login error: invalid token");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthReady }}>

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
