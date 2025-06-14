import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';

import { SnackbarProvider } from 'notistack'; // ✅ Adicionado
import AppContextProvider from './contexts/AppContextProvider';

// estilos de carrossel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// ✅ Se quiser usar notificações globais fora do React:
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { setNotifier } from './services/notifier';  // criar esse se quiser

export const BaseDir = import.meta.env.VITE_APP_BASE_NAME || '/wayne';
export const isDebug = true;

export const customSvgEditIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <path
      fill="currentColor"
      d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"
    />
  </svg>
);

function GlobalNotifierSetup() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setNotifier(enqueueSnackbar); // ✅ Configura notifier global
  }, [enqueueSnackbar]);

  return null;
}

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <SnackbarProvider maxSnack={3} autoHideDuration={60000}>
          <GlobalNotifierSetup /> {/* ✅ Se quiser notificações fora de componentes */}
          <AppContextProvider>
            <RouterProvider router={router} />
          </AppContextProvider>
        </SnackbarProvider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
