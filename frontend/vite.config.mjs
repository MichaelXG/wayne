import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = env.VITE_PORT || 3000; // ✅ Agora acessa corretamente do `.env`

  return {
    server: {
      open: false, // ✅ Evita erro no Docker ao tentar abrir o navegador automaticamente
      port: Number(PORT), // ✅ Certifica que o valor seja um número
      host: '0.0.0.0' // ✅ Permite acesso externo no Docker
    },
    build: {
      chunkSizeWarningLimit: 1600
    },
    preview: {
      open: false, // ✅ Desativado no modo preview
      host: '0.0.0.0'
    },
    define: {
      global: 'window' // ⚠️ Apenas necessário se bibliotecas externas precisarem
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // ✅ Melhor compatibilidade
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    },
    base: API_URL, // ✅ Define corretamente a base da aplicação
    plugins: [react(), jsconfigPaths()]
  };
});
