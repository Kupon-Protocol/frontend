import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap' 
import 'bootstrap-icons/font/bootstrap-icons.css'
import { VueDapp } from 'vue-dapp'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import './index.css'

const app = createApp(App)

const options = {
  timeout: 5000,
  hideProgressBar: true,
  closeButton: "button",
  position:POSITION.TOP_LEFT,
  toastClassName: "kupon-toast-class",
}

app.use(router)
app.use(VueDapp, {
  infuraId: '',
})

app.use(Toast, options);

app.mount('#app')
