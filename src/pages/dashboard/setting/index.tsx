import DashboardLayout from "@/layouts/dashboard";

export default function SettingPage() {
  return <>setting</>;
}

SettingPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
