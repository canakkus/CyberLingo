<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5DC1E3] via-[#A8AFE3] to-[#785DE3] font-work-sans">
    <div class="backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border-2 border-[#5D97E3] font-work-sans">
      <!-- SVG Illustration: Hacker/Shield/Lock -->
      <div class="mb-4 flex justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" fill="#A8AFE3" stroke="#5D97E3" stroke-width="4"/>
          <rect x="25" y="38" width="30" height="20" rx="6" fill="#5DC1E3" stroke="#5D6DE3" stroke-width="2"/>
          <circle cx="40" cy="48" r="4" fill="#785DE3"/>
          <rect x="33" y="28" width="14" height="12" rx="5" fill="#5D97E3" stroke="#5D6DE3" stroke-width="2"/>
          <rect x="36" y="22" width="8" height="10" rx="4" fill="#AD6CE6"/>
        </svg>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold mb-2 text-center font-work-sans tracking-tight text-[#5D6DE3]">
        Lerne Cybersecurity wie ein Pro!
      </h1>
      <div class="text-[#785DE3] text-center mb-6 font-semibold">5 Missionen • Gamified • HTL-Level</div>
      <div id="g_id_onload"
           data-client_id="787643878218-7fi5mq8dee6fb37j5pcs1srsuafitlgl.apps.googleusercontent.com"
           data-callback="handleCredentialResponse"
           data-auto_prompt="false">
      </div>
      <div class="g_id_signin rounded-full !bg-[#5D97E3] hover:!bg-[#5DC1E3] focus:!ring-2 focus:!ring-[#785DE3] text-white font-bold text-lg shadow-lg transition-all duration-150 mt-2 mb-4"
           data-type="standard" data-size="large" data-theme="filled_blue" data-text="sign_in_with" data-shape="pill" data-logo_alignment="left"></div>
      
      <transition name="fade">
        <form v-if="user" class="w-full flex flex-col items-center mt-4 font-work-sans" @submit.prevent="startMission">
          <label class="w-full text-left font-medium mb-2 font-work-sans text-[#785DE3]" for="name">Dein Name</label>
          <input id="name" v-model="name" class="w-full px-4 py-2 rounded-full bg-[#A8AFE3]/80 border-2 border-[#5D97E3] focus:outline-none focus:ring-2 focus:ring-[#AD6CE6] mb-4 text-lg font-semibold shadow font-work-sans text-[#5D6DE3] placeholder-[#5D97E3]" autocomplete="name" />
          <button
            type="submit"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#5D97E3] hover:bg-[#5DC1E3] focus:ring-2 focus:ring-[#785DE3] text-white font-bold shadow-lg transition-all duration-150 font-work-sans text-lg tracking-wide"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Missionen starten
          </button>
        </form>n
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
