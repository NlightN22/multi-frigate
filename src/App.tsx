import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';
import AppBody from './AppBody';
import { FfprobeModal } from './shared/components/modal.windows/FfprobeModal';
import { VaInfoModal } from './shared/components/modal.windows/VaInfoModal';
import { useRealmAccessRoles } from './hooks/useRealmAccessRoles';
import { useAdminRole } from './hooks/useAdminRole';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

const modals = {
  ffprobeModal: FfprobeModal,
  vaInfoModal: VaInfoModal,
}

declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

function App() {
  const systemColorScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getCookie('mantine-color-scheme') as ColorScheme || systemColorScheme)
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme)
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
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
            <ModalsProvider modals={modals}>
              <Notifications />
              <AppBody />
            </ModalsProvider>
          </MantineProvider >
        </ColorSchemeProvider>
      </div>
    </QueryClientProvider>
  );
}
export default App;
