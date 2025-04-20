import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from './router'

// Import font chữ
import 'vfonts/Lato.css' // Hoặc OpenSans.css, tùy bạn chọn

// Thông thường bạn cũng cần import font chữ
// import 'vfonts/Lato.css'
// Hoặc tự host fonts
// import 'vfonts/OpenSans.css'

createApp(App)
  .use(naive)
  .use(router)
  .mount('#app')
