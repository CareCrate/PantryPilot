import type { AppProps } from 'next/app'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Layout from '@/components/layout'
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';


export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const toggleMode = () => {
    const selectedMode = mode === 'light' ? 'dark' : 'light';
    setMode(selectedMode);
    localStorage.setItem('mode', selectedMode);
  };
  const theme = createTheme({
    palette: {
      mode: mode
    },
    components: {
      MuiButton: {
        variants: [
          {
            props: {
              variant: 'contained'
            },
            style: {
              backgroundColor: '#C2AFF0', // Purple
              opacity: '80%',
              transition: 'background-color .2s, box-shadow .2s, color .2s',
              '&:hover': {
                backgroundColor: '#C2AFF0',
                opacity: '100%'
              }
            }
          }
        ]
      }
    }
  });

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Layout toggleMode={toggleMode}>
            <Component {...pageProps} toggleMode={toggleMode} />
          </Layout>
        </CssBaseline>
      </ThemeProvider>
    </SessionProvider>
  )
}
