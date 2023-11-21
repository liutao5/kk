import { AuthGuard } from "@/auth";
import Header from "@/components/header";
import Main from "@/components/main";
import Nav from "@/components/nav";
import useResponsive from "@/hooks/useResponsive";
import { ChildrenParams } from "@/types/common";
import { Box } from "@mui/material";

export default function DashboardLayout({ children }: ChildrenParams) {
  const isDesktop = useResponsive("up", "lg");

  return (
    <AuthGuard>
      <Header />

      <Box
        sx={{
          display: { lg: "flex" },
          minHeight: { lg: 1 },
        }}
      >
        <Nav />
        <Main>{children}</Main>
      </Box>
    </AuthGuard>
  );
}
