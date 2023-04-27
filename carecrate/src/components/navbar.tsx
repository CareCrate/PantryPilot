import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Menu, MenuItem, FormControlLabel, Stack, Switch, Icon } from "@mui/material";
import Modal from "@/components/dashboard/Modal";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import TimelineIcon from '@mui/icons-material/Timeline';
import TuneIcon from '@mui/icons-material/Tune';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ChangeEvent, useState } from "react";
import { GetServerSideProps } from 'next';
import { useSession, getSession, GetSessionParams, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { SessionUser } from '@/types';

interface NavbarProps {
    toggleMode: () => void;
};

export default function Navbar({ toggleMode }: NavbarProps) {
    const { data: session } = useSession();
    const user = session?.user as SessionUser | undefined;
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

    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const handleReportsClick = () => {
        setIsReportsModalOpen(true);
    };
    const resetReportsModal = () => {
        setIsReportsModalOpen(false);
    };
    const saveReports = () => {
        resetReportsModal();
    };

    return (
        <AppBar position='static' elevation={0} sx={{ background: '#C2AFF0' }}>
            <Toolbar>
                {session && (
                    <Stack spacing={0} sx={{ flexGrow: 1 }}>
                        <Typography variant='h5' component='div' sx={{ flexGrow: 1, color: '#FFF' }}>PantryPilot</Typography>
                        <Typography variant='subtitle1' component='div' sx={{ flexGrow: 1, color: '#FFF' }}>Hi, {session?.user?.name}</Typography>
                    </Stack>
                )}
                {!session && (
                    <Typography variant='h5' component='div' sx={{ flexGrow: 1, color: '#FFF' }}>PantryPilot</Typography>
                )}
                <Box component='div'>
                    <Stack direction='row' sx={{ alignItems: 'center' }}>
                        {session && (
                            <>
                                <IconButton size='large' disableRipple disableFocusRipple disableTouchRipple href='/dashboard'>
                                    <DashboardIcon fontSize='large' sx={{ color: '#FFF' }} />
                                </IconButton>
                                {(user?.role === 'admin') && (
                                    <IconButton size='large' disableRipple disableFocusRipple disableTouchRipple onClick={handleReportsClick}>
                                        <TimelineIcon fontSize='large' sx={{ color: '#FFF' }} />
                                    </IconButton>
                                )}
                                <IconButton size='large' disableRipple disableFocusRipple disableTouchRipple onClick={handleMenu}>
                                    <AccountCircle fontSize='large' sx={{ color: '#FFF' }} />
                                </IconButton>
                                <IconButton size='large' disableRipple disableFocusRipple disableTouchRipple href='/settings'>
                                    <TuneIcon fontSize='large' sx={{ color: '#FFF' }} />
                                </IconButton>
                            </>
                        )}
                        {!session && (
                            <>
                                <Button color='inherit' href='/login'>Login</Button>
                                <Button color='inherit' href='/register'>Register</Button>
                            </>
                        )}
                        <IconButton size='large' onClick={toggleMode}>
                            <Brightness6Icon fontSize='small' />
                        </IconButton>
                    </Stack>
                    {session && (
                        <Menu id='profile_menu' anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose} sx={{ marginTop: '2em', marginLeft: '-1em' }}>
                            <MenuItem onClick={handleSignout}>Logout</MenuItem>
                        </Menu>
                    )}
                    <Modal
                        open={isReportsModalOpen}
                        onClose={() => setIsReportsModalOpen(false)}
                        title="Reports"
                        content="Amazing reports text that goes here."
                        submitText="Submit"
                        inputFields={[]}
                        onSubmit={saveReports}
                        onCancel={resetReportsModal}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    )
}