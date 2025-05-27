import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = Number(env.VITE_PORT) || 3000;

  return {
    server: {
      open: false,
      port: PORT,
      host: '0.0.0.0',
      strictPort: true, // Força erro se a porta estiver ocupada
      fs: {
        strict: true
      }
    },
    build: {
      chunkSizeWarningLimit: 1600,
      commonjsOptions: {
        include: [/node_modules/]
      }
    },
    preview: {
      open: false,
      host: '0.0.0.0'
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths()],
    optimizeDeps: {
      include: [
        '@mui/material',
        '@mui/icons-material',
        '@mui/system',
        '@emotion/react',
        '@emotion/styled'
        // ✅ adicione outros pacotes necessários
      ],
      exclude: [
        // ✅ adicione aqui as dependências problemáticas
        'chunk-MNXAHIXX'
      ]
    },
    cacheDir: 'node_modules/.vite', // define explicitamente o diretório de cache
    clearScreen: false // para melhor visualização de logs em dev
  };
});
