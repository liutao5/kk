import { ChildrenParams } from "@/types/common";
import { AuthContext } from "./AuthProvider";
import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthContext } from "./useAuthContext";
import { useRouter } from "next/router";

export default function GuestGuard({ children }: ChildrenParams) {
  const { isAuthenticated } = useAuthContext();
  const { push } = useRouter();
  if (isAuthenticated) {
    push("/dashboard");
  }
  return <>{children}</>;
}
