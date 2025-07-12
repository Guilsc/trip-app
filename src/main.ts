import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Import custom styles
import '@/assets/app.scss'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'
import { Notify, Quasar } from 'quasar'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: { Notify },
  config: {
    brand: {
      primary: '#819e6a',
      secondary: '#f26c57',
      tertiary: '#322222',
    },
  },
})

app.mount('#app')
