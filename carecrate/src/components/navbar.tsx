import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem, FormControlLabel, Stack, Switch } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { ChangeEvent, useState } from "react";

export default function Navbar() {

    // TODO: Replace with real Account Name
    const ACCOUNT_NAME: string = 'John';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMenu = (event: ChangeEvent<HTMLElement>) => {
        setAnchorEl(event?.currentTarget);
    };

    const theme = useTheme();
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const toggleMode = () => {
        const selectedMode = mode === 'light' ? 'dark' : 'light';
        setMode(selectedMode);
        localStorage.setItem('mode', selectedMode);
        theme.palette.mode = selectedMode;
    };

    return (
        <AppBar position='static' elevation={0} sx={{ background: '#C2AFF0' }}>
            <Toolbar>
                <Typography variant='h5' component='div' sx={{ flexGrow: 1, color: '#FFF' }}>Good Morning, {ACCOUNT_NAME}</Typography>
                <Box component='div'>
                    <Stack direction='row' sx={{ alignItems: 'center' }}>
                        <IconButton size='large' disableRipple disableFocusRipple disableTouchRipple onClick={handleMenu}>
                            <AccountCircle fontSize='large' sx={{ color: '#FFF' }}/>
                        </IconButton>
                        <IconButton size='large' onClick={toggleMode}>
                            <Brightness6Icon fontSize='small' />
                        </IconButton>
                    </Stack>
                    <Menu id='profile_menu' anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose} sx={{ marginTop: '2em', marginLeft: '-1em' }}>
                        <MenuItem onClick={handleClose}>Settings</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}