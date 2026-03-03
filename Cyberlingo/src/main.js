// main.js – KOMPLETT ersetzen
import { createApp } from 'vue'
import Vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import './style.css'

createApp(App).use(Vue3GoogleLogin, {
  clientId: '787643878218-7fi5mq8dee6fb37j5pcs1srsuafitlgl.apps.googleusercontent.com'
}).mount('#app')
