import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap' 
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import { VueDapp } from 'vue-dapp'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
const options={
  
}
app.use(router)
app.use(VueDapp, {
  infuraId: '',
})

app.use(Toast, options);

app.mount('#app')
