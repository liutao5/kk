import { ChildrenParams } from "@/types/common";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useRouter } from "next/router";
import LoginPage from "@/pages/auth";

export default function AuthGuard({ children }: ChildrenParams) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  if (isInitialized && !isAuthenticated) {
    console.log("pathname", pathname, requestedLocation);
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <LoginPage />;
  }
  return <>{children}</>;
}
