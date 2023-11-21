import ThemeProvider from "@/theme";
import { AuthProvider } from "@/auth";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { LicenseInfo } from "@mui/x-license-pro";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

const licenseKey =
  "b972836bdf5bc99bd9ab3c9eecc16bf0Tz03MjkzNCxFPTE3MjM5MDkzOTIwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y";
LicenseInfo.setLicenseKey(licenseKey);

export default function RootLayout({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}
