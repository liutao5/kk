import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/dashboard/formula");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export const statusMap: Record<number, string> = {
  0: "待使用",
  3: "已使用",
  5: "已取消",
};
