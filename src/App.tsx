import { useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import CenterLoader from './shared/components/loaders/CenterLoader';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { getCookie, setCookie } from 'cookies-next';
import { BrowserRouter } from 'react-router-dom';
import AppBody from './AppBody';
import Forbidden from './pages/403';
import { QueryClient } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';


function App() {
  const systemColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getCookie('mantine-color-scheme') as ColorScheme || systemColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme)
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  }

  const auth = useAuth();
  // automatically sign-in
  useEffect(() => {
    if (!hasAuthParams() &&
      !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    }
  }, [auth, auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  if (auth.activeNavigator || auth.isLoading) {
    return <CenterLoader />
  }
  if ((!auth.isAuthenticated && !auth.isLoading) || auth.error) {
    console.error(`auth.error:`, auth.error)
    return <Forbidden />
  }

  return (
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
              // Image: {
              //   styles: (theme) => ({
              //     placeholder: {
              //       backgroundColor: 'transparent',
              //     }
              //   })
              // },
            }
          }}
        >
          <BrowserRouter>
            <Notifications />
            <AppBody />
          </BrowserRouter>
        </MantineProvider >
      </ColorSchemeProvider>
    </div>
  );
}
export default App;
