import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap' 
import './index.css'
import { VueDapp } from 'vue-dapp'

const app = createApp(App)

app.use(router)
app.use(VueDapp, {
  infuraId: '',
})

app.mount('#app')
