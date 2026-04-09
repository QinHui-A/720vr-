import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import '@/assets/css/tailwind.css'
import '@/assets/css/reset-style.less'
import router from "./routes";
import releaseRouter from "./routes/release.ts";
import {createPinia} from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
const envType = import.meta.env.VITE_APP_MODE
if (['designDev', 'designPro'].includes(envType)) {
  app.use(router)
} else {
  app.use(releaseRouter)
}
app.mount('#app')
