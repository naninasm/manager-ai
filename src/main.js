import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
const app = createApp(App)
const pinia = createPinia()
import router from './router'
app.use(router)

import './assets/main.css'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'
app.use(pinia)
app.use(ElementPlus, { locale: zhLocale }) // 使用 Element Plus

app.mount('#app')