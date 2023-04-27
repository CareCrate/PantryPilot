import { Alert, AlertTitle, Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { useSession, getSession, GetSessionParams, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [alertState, setAlertState] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "error" });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const result = await signIn("workspace", {
        callbackUrl: "/dashboard",
        workspace: data.get("workspace"),
        email: data.get("email"),
        password: data.get("password")
      });

      // Alert Popup
      if (result && result.error) {
        setAlertState({ open: true, message: result.error, severity: "error" });
      } else {
        setAlertState({ open: true, message: "Logged in successfully", severity: "success" });
        window.location.href = "/dashboard";
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setAlertState({ open: true, message: errorMessage, severity: "error" });
    }
  };

  return (
    <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      {alertState.open && (
        <Alert severity={alertState.severity} onClose={() => setAlertState(prevState => ({ ...prevState, open: false }))} sx={{ mb: 2 }}>
          <AlertTitle>{alertState.severity === "success" ? "Success" : "Error"}</AlertTitle>
          {alertState.message}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth id="workspace" name="workspace" label="Workspace" type="text" autoComplete="workspace-id" />
        <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
        <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="view password" onClick={togglePasswordVisibility} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
              </InputAdornment>
            )
          }}
        />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth disableElevation disableRipple disableTouchRipple variant="contained" sx={{ mt: 3, mb: 2, textTransform: "none" }}>
          Sign In
        </Button>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async (context: GetSessionParams | undefined) => {
  return {
    props: {
      session: await getSession(context)
    }
  };
};
