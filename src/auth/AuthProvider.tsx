"use client";
import { ChildrenParams } from "@/types/common";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { login as loginRequest } from "@/api/auth";
import { getSession, setSession } from "./Token";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ code: number; msg: string }>;
  logout: VoidFunction;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: ChildrenParams) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    if (getSession()) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setSession(getSession());
    setInitialized(true);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginRequest(username, password);
    if (res.data.code === 200) {
      setSession(res.data.token);
      setAuthenticated(true);
    }
    return res.data;
  };

  const logout = useCallback(() => {
    setSession(null);
    setAuthenticated(false);
    push("/auth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedValue = useMemo(
    () => ({ isAuthenticated, isInitialized, login, logout }),
    [isAuthenticated, isInitialized, logout]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
