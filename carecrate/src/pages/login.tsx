import { Box, Button, Checkbox, FormControlLabel, Link, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { useSession, getSession } from 'next-auth/react';


export default function Signup() {
  const { data: session, status } = useSession()
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget)
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  }

  return (
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">Sign in</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
        <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth disableElevation disableRipple disableTouchRipple variant="contained" sx={{ mt: 3, mb: 2, textTransform: 'none' }}>Sign In</Button>
        <Link href="/signup"> Not registered? </Link>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async (context) => {
  return {
    props: {
      session: await getSession(context)
    }
  }
}