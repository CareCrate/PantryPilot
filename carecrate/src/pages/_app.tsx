import type { AppProps } from 'next/app'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import Layout from '@/components/layout'

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    components: {
      MuiButton: {
        variants: [
          {
            props: {
              variant: 'contained'
            },
            style: {
              backgroundColor: '#A264F6', // Purple
              opacity: '80%',
              transition: 'background-color .2s, box-shadow .2s, color .2s',
              '&:hover': {
                backgroundColor: '#A264F6',
                opacity: '100%'
              }
            }
          }
        ]
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CssBaseline>
    </ThemeProvider>
  )
}
