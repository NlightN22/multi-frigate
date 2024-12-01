import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import AppBody from './AppBody';
import { SideBarProvider } from './widgets/sidebars/SideBarContext';
import { modals } from './shared/components/modal.windows/modals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  const systemColorScheme = useColorScheme()

  const cookieColorScheme = getCookie('mantine-color-scheme') as ColorScheme | null

  const selectedColorScheme = cookieColorScheme || systemColorScheme

  const [colorScheme, setColorScheme] = useState<ColorScheme>(selectedColorScheme)
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme)
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  }


  useEffect(() => {
    setColorScheme(selectedColorScheme);
  }, [selectedColorScheme]);

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
                ActionIcon: {
                  styles: (theme) => ({
                    root: {
                      '&:hover': {
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2],
                      },
                    },
                  }),
                }

              }
            }}
          >
            <ModalsProvider modals={modals}>
              <SideBarProvider>
                <Notifications />
                <AppBody />
              </SideBarProvider>
            </ModalsProvider>
          </MantineProvider >
        </ColorSchemeProvider>
      </div>
    </QueryClientProvider>
  );
}
export default App;
