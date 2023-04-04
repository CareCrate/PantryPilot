import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, FormControlLabel, Stack, Switch } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { ChangeEvent, useState } from "react";
import { GetServerSideProps } from 'next';
import { useSession, getSession, GetSessionParams, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface NavbarProps {
    toggleMode: () => void;
};

export default function Navbar({ toggleMode }: NavbarProps) {
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMenu = (event: ChangeEvent<HTMLElement>) => {
        setAnchorEl(event?.currentTarget);
    };
    const handleSignout = async () => {
        await signOut({ callbackUrl: '/login' });
        setAnchorEl(null);
    };

    return (
        <AppBar position='static' elevation={0} sx={{ background: '#C2AFF0' }}>
            <Toolbar>
                {session && (
                    <Typography variant='h5' component='div' sx={{ flexGrow: 1, color: '#FFF' }}>Good Morning, {session?.user?.name}</Typography>
                )}
                {!session && (
                    <Typography variant='h5' component='div' sx={{ flexGrow: 1, color: '#FFF' }}>CareCrate</Typography>
                )}
                <Box component='div'>
                    <Stack direction='row' sx={{ alignItems: 'center' }}>
                        {session && (
                            <IconButton size='large' disableRipple disableFocusRipple disableTouchRipple onClick={handleMenu}>
                                <AccountCircle fontSize='large' sx={{ color: '#FFF' }}/>
                            </IconButton>
                        )}
                        <IconButton size='large' onClick={toggleMode}>
                            <Brightness6Icon fontSize='small' />
                        </IconButton>
                    </Stack>
                    {session && (
                        <Menu id='profile_menu' anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose} sx={{ marginTop: '2em', marginLeft: '-1em' }}>
                            {/* TODO: Implement Settings. */}
                            {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                            <MenuItem onClick={handleSignout}>Logout</MenuItem>
                        </Menu>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async (context: GetSessionParams | undefined) => {
    return {
      props: {
        session: await getSession(context)
      }
    }
}