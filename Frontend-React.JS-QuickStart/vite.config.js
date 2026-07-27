import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Nạp biến môi trường từ cả file .env và từ hệ thống Vercel (process.env)
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = { ...env, ...process.env };

  // Xử lý chuẩn hóa URL backend luôn luôn có http:// hoặc https://
  let backendUrl = processEnv.REACT_APP_BACKEND_URL || 'http://localhost:8080';
  if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    backendUrl = `https://${backendUrl}`;
  }

  return {
    plugins: [
      react({
        jsxRuntime: 'classic', // Sử dụng chuẩn React.createElement của React 17 cho Class Components
      }),
    ],
    // Cấu hình esbuild dùng React.createElement (classic transform) để không bị lỗi jsxDEV trên Production
    esbuild: {
      loader: 'jsx',
      jsx: 'transform',
      include: /src\/.*\.js$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        jsx: 'transform',
      },
    },
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
      ],
    },
    server: {
      port: 3000,
      open: true,
    },
    define: {
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(backendUrl),
      'process.env.REACT_APP_ROUTER_BASE_NAME': JSON.stringify(processEnv.REACT_APP_ROUTER_BASE_NAME || ''),
      'process.env.REACT_APP_IS_LOCALHOST': JSON.stringify(processEnv.REACT_APP_IS_LOCALHOST || '0'),
      'process.env.NODE_ENV': JSON.stringify(mode),
      global: 'window',
    },
  };
});
