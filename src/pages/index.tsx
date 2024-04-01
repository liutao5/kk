import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/dashboard/formula");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
