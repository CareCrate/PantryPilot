import { Box, Container, Paper, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Paper component='footer' square variant='outlined' sx={{ marginTop: 'calc(10% + 60px)', width: '100%', position: 'relative', bottom: 0 }}>
            <Container maxWidth='lg'>
                <Box sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', display: 'flex', my: 2 }}>
                    <Typography variant='caption' color='initial' align='center'>©{' '+new Date().getFullYear()+' CareCrate'}</Typography>
                </Box>
            </Container>
        </Paper>
    )
}