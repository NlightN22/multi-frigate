import { useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import CenterLoader from './shared/components/loaders/CenterLoader';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { getCookie, setCookie } from 'cookies-next';
import AppBody from './AppBody';
import Forbidden from './pages/403';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RetryErrorPage from './pages/RetryErrorPage';
import { keycloakConfig } from '.';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  const maxErrorAuthCounts = 2
  const systemColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getCookie('mantine-color-scheme') as ColorScheme || systemColorScheme)
  const [authErrorCounter, setAuthErrorCounter] = useState(0)
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme)
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  }

  const auth = useAuth()

  // automatically sign-in
  useEffect(() => {
    if (!hasAuthParams() &&
      !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && authErrorCounter < maxErrorAuthCounts) {
      console.error('Not authenticated! Redirect! ErrorCounter', authErrorCounter)
      setAuthErrorCounter(prevCount => prevCount + 1)
      auth.signinRedirect()
    }
  }, [auth, auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect, authErrorCounter])


  if (auth.activeNavigator || auth.isLoading) {
    return <CenterLoader />
  }

  if (authErrorCounter > maxErrorAuthCounts) {
    console.error('maxErrorAuthCounts authority', keycloakConfig.authority)
    console.error('maxErrorAuthCounts client_id', keycloakConfig.client_id)
    console.error('maxErrorAuthCounts redirect_uri', keycloakConfig.redirect_uri)
    return <RetryErrorPage backVisible={false} mainVisible={false} onRetry={() => auth.signinRedirect()} />
  }


  if (!auth.isAuthenticated && !auth.isLoading && authErrorCounter < maxErrorAuthCounts) {
    if (hasAuthParams()) {
      console.warn('Not authenticated, isAuthenticated:', auth.isAuthenticated)
      console.warn('Not authenticated, isLoading:', auth.isLoading)
      return <RetryErrorPage backVisible={false} mainVisible={false} onRetry={() => auth.signinRedirect()} />
    } else {
      console.error('Not authenticated! Redirect! Error Counter:', authErrorCounter)
      setAuthErrorCounter(prevCount => prevCount + 1);
      auth.signinRedirect()
    }
  }

  if ((!hasAuthParams() && !auth.isAuthenticated && !auth.isLoading) || auth.error) {
    setAuthErrorCounter(prevCount => prevCount + 1)
    console.error(`auth.error:`, auth.error)
    return <Forbidden />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              // fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji', //default system fonts
              colorScheme: colorScheme,
              components: {
                Button: {
                  defaultProps: {
                    radius: "xl",
                  }
                },
              }
            }}
          >
            <Notifications />
            <AppBody />
          </MantineProvider >
        </ColorSchemeProvider>
      </div>
    </QueryClientProvider>
  );
}
export default App;
