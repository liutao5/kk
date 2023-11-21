import { Alert, Box, Button, Stack, Typography, styled } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFInput from "@/components/hook-form/RHFInput";
import FormProvider from "@/components/hook-form/FormProvider";
import { useAuthContext } from "@/auth/useAuthContext";
import LoginLayout from "./layout";

type LoginValueProps = {
  username: string;
  password: string;
  afterSubmit?: boolean;
};

const StyledSection = styled("div")(({ theme }) => ({
  display: "none",
  position: "relative",
  [theme.breakpoints.up("md")]: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
}));

const StyledContent = styled("div")(({ theme }) => ({
  width: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  justifyContent: "center",
  padding: theme.spacing(15, 2),
  [theme.breakpoints.up("md")]: {
    flexShrink: 0,
    padding: theme.spacing(30, 8, 0, 8),
  },
}));

export default function LoginPage() {
  const { login } = useAuthContext();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("请输入用户名"),
    password: Yup.string().required("请输入密码"),
  });

  const defaultValues = {
    username: "",
    password: "",
  };

  const methods = useForm<LoginValueProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: LoginValueProps) => {
    const { username, password } = data;
    const res = await login(username, password);
    if (res.code === 500) {
      reset();
      setError("afterSubmit", {
        message: res.msg,
      });
    }
  };

  return (
    <Box
      component="main"
      sx={{
        height: "100%",
        display: "flex",
        position: "relative",
      }}
    >
      <StyledSection>
        <Typography
          variant="h3"
          sx={{ mb: 10, maxWidth: 480, textAlign: "center" }}
        >
          Hi, Welcome back
        </Typography>
        <Box
          alt="login_bg"
          component="img"
          src="/assets/login_bg.png"
          sx={{ width: 720, height: 480 }}
        />
      </StyledSection>
      <StyledContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {!!errors.afterSubmit && (
              <Alert severity="error">{errors.afterSubmit.message}</Alert>
            )}
            <RHFInput label="用户名" name="username" />
            <RHFInput label="密码" type="password" name="password" />
            <Button size="large" type="submit" variant="contained">
              登录
            </Button>
          </Stack>
        </FormProvider>
      </StyledContent>
    </Box>
  );
}

LoginPage.getLayout = (page: React.ReactElement) => (
  <LoginLayout>{page}</LoginLayout>
);
