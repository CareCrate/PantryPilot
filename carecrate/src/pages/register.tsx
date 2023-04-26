import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Signup() {
  const [formData, setFormData] = useState({
    workspace: '',
    email: '',
    name: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Make a request to your backend to create a new workspace and admin user
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // TODO: Auto-login after workspace creation.
        router.push('/login');
      } else {
        // TODO: Handle Error.
      }
    } catch (error) {
      // TODO: Handle Error.
    }
  };

  return (
    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">Register</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth id="workspace" name="workspace" label="Workspace Name" type="text" autoComplete="workspace-id" onChange={handleChange} value={formData.workspace} />
        <TextField margin="normal" required fullWidth id="name" name="name" label="Name" type="text" autoComplete="name" onChange={handleChange} value={formData.name} />
        <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus onChange={handleChange} value={formData.email} />
        <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" autoComplete="current-password" onChange={handleChange} value={formData.password} />
        <Button type="submit" fullWidth disableElevation disableRipple disableTouchRipple variant="contained" sx={{ mt: 3, mb: 2, textTransform: 'none' }}>Submit</Button>
      </Box>
    </Box>
  );
}
