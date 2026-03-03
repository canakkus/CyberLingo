<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 font-work-sans">
    <div class="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center border border-gray-200 font-work-sans">
      <h1 class="text-3xl font-bold text-blue-700 mb-6 text-center font-work-sans tracking-tight">
        Welcome to Cyberlingo
      </h1>
      
      <!-- Google Button direkt -->
      <div id="g_id_onload"
           data-client_id="787643878218-7fi5mq8dee6fb37j5pcs1srsuafitlgl.apps.googleusercontent.com"
           data-callback="handleCredentialResponse"
           data-auto_prompt="false">
      </div>
      <div class="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left"></div>
      
      <transition name="fade">
        <form v-if="user" class="w-full flex flex-col items-center mt-4 font-work-sans" @submit.prevent="startMission">
          <label class="w-full text-left text-gray-700 font-medium mb-2 font-work-sans" for="name">Dein Name</label>
          <input id="name" v-model="name" class="w-full px-4 py-2 rounded-lg bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 text-lg font-semibold shadow font-work-sans" autocomplete="name" />
          <button
            type="submit"
            class="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white font-semibold shadow-md transition-all duration-150 font-work-sans text-lg tracking-wide"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Missionen starten
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const name = ref('')

// Globale Callback Funktion
window.handleCredentialResponse = (response) => {
  const responsePayload = decodeJwtResponse(response.credential)
  console.log('ID Token:', responsePayload)
  user.value = responsePayload
  name.value = responsePayload.name || ''
}

// JWT Decoder
function decodeJwtResponse(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (e) {
    console.error('Decode Error:', e)
    return null
  }
}

function startMission() {
  alert(`Willkommen, ${name.value}! Missionen starten...`)
}

// Google Script laden
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Work+Sams:wght@400;600;700&display=swap');

.font-work-sans { font-family: 'Work Sans', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
