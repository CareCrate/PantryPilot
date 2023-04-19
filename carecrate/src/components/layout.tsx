import { Box } from '@mui/material';
import Footer from './footer';
import Navbar from './navbar';

interface LayoutProps {
    children: React.ReactNode;
    toggleMode: () => void;
}

export default function Layout({ children, toggleMode }: LayoutProps) {
    return (
        <>
            <Navbar toggleMode={toggleMode}/>
            <Box component='main' sx={{ flex: '1 0 auto', minHeight: '100vh' }}>
                { children }
            </Box>
            <Footer />
        </>
    )
}