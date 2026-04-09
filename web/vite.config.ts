import {defineConfig, loadEnv, PluginOption} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'path'

const getEnvConfig = (envType) => {
  if (['designDev', 'designPro'].includes(envType)) {
    return {
      outDir: 'dist/design',
    }
  }
  return {
    outDir: 'dist/release',
  }
}

// https://vite.dev/config/
export default ({mode}) => {
  const envType: string = loadEnv(mode, __dirname).VITE_APP_MODE
  console.log(envType, '???')
  const {outDir} = getEnvConfig(envType)
  return defineConfig({
    base: './',
    plugins: [
      vue(),
      tailwindcss()
    ],
    build: {
      outDir: outDir,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // 后端服务地址
          changeOrigin: true, // 必须 true，否则跨域可能失败
          secure: false,      // 如果后端是 http，设为 false
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
    }
  })
}
