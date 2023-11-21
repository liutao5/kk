import { useEffect } from "react";
import DashboardPage from "./dashboard";
import DashboardLayout from "./dashboard/layout";
import { useRouter } from "next/router";

export default function HomePage() {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/dashboard/formula");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
