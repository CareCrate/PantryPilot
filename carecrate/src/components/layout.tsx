import { Box } from '@mui/material';
import Footer from './footer';
import Navbar from './navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <Box component='main' sx={{ flex: '1 0 auto', minHeight: '100vh' }}>
                { children }
            </Box>
            <Footer />
        </>
    )
}