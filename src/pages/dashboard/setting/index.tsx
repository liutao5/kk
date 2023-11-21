import DashboardLayout from "../layout";

export default function SettingPage() {
  return <>setting</>;
}

SettingPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
