import { AuthProvider } from "@/auth";
import { SettingsProvider, ThemeSettings } from "@/components/settings";
import SnackbarProvider from "@/components/snackbar";
import ThemeProvider from "@/theme";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LicenseInfo } from "@mui/x-license-pro";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";

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
    <>
      <Head>
        <title>宜兴困库管理系统</title>
      </Head>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <ThemeProvider>
              {/* <ThemeSettings> */}
              <SnackbarProvider>
                {getLayout(<Component {...pageProps} />)}
              </SnackbarProvider>
              {/* </ThemeSettings>  */}
            </ThemeProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </AuthProvider>
    </>
  );
}
