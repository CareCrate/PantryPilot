import { Alert, AlertTitle, Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { useSession, getSession, GetSessionParams, signIn } from 'next-auth/react';
import { useState } from 'react';


export default function Login() {
  const { data: session, status } = useSession();

  const [alertState, setAlertState] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'error' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget)
    const result = await signIn('workspace', {
      callbackUrl: '/dashboard',
      workspace: data.get('workspace'),
      email: data.get('email'),
      password: data.get('password')
    });

    // Alert Popup
    if (result && result.error) {
      setAlertState({ open: true, message: result.error, severity: 'error' });
    } else {
      setAlertState({ open: true, message: 'Logged in successfully', severity: 'success' });
    }
  }

  return (
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">Sign in</Typography>
      {alertState.open && (
        <Alert severity={alertState.severity} onClose={() => setAlertState((prevState) => ({ ...prevState, open: false }))} sx={{ mb: 2 }}>
          <AlertTitle>{alertState.severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alertState.message}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth id="workspace" name="workspace" label="Workspace" type="text" autoComplete="workspace-id" />
        <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
        <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" autoComplete="current-password" />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth disableElevation disableRipple disableTouchRipple variant="contained" sx={{ mt: 3, mb: 2, textTransform: 'none' }}>Sign In</Button>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async (context: GetSessionParams | undefined) => {
  return {
    props: {
      session: await getSession(context)
    }
  }
}