<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 font-work-sans">
    <div class="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center border border-gray-200">
      <h1 class="text-3xl font-bold text-blue-700 mb-6 text-center font-work-sans tracking-tight">
        Welcome to Cyberlingo
      </h1>
      <GoogleSignInButton
        :clientId="googleClientId"
        @success="onGoogleSignIn"
        class="w-full mb-6"
      >
        <span class="flex items-center justify-center gap-2 font-semibold text-blue-700">
          <svg class="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C36.36 2.34 30.55 0 24 0 14.64 0 6.4 5.48 2.44 13.44l8.06 6.27C12.98 13.13 18.01 9.5 24 9.5z"/><path fill="#34A853" d="M46.09 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.44c-.54 2.9-2.17 5.36-4.62 7.02l7.19 5.59C43.98 37.13 46.09 31.36 46.09 24.5z"/><path fill="#FBBC05" d="M10.5 28.44c-1.13-3.36-1.13-6.96 0-10.32l-8.06-6.27C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 2.44 11.15l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.55 0 12.36-2.17 16.62-5.93l-7.19-5.59c-2.01 1.35-4.59 2.15-7.43 2.15-5.99 0-11.02-3.63-13.5-8.94l-8.06 6.27C6.4 42.52 14.64 48 24 48z"/></g></svg>
          Mit Google anmelden
        </span>
      </GoogleSignInButton>
      <transition name="fade">
        <form v-if="user" class="w-full flex flex-col items-center mt-4" @submit.prevent="startMission">
          <label class="w-full text-left text-gray-700 font-medium mb-2" for="name">Dein Name</label>
          <input
            id="name"
            v-model="name"
            class="w-full px-4 py-2 rounded-lg bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 text-lg font-semibold shadow"
            autocomplete="name"
          />
          <button
            type="submit"
            class="w-full py-2 rounded-lg bg-linear-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Missionen starten
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GoogleSignInButton } from 'vue3-google-signin'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const user = ref(null)
const name = ref('')

onMounted(() => {
  console.log('Google Client ID:', googleClientId)
})

function onGoogleSignIn(googleUser) {
  user.value = googleUser
  name.value = googleUser?.profileObj?.name || ''
}

function startMission() {
  alert(`Willkommen, ${name.value}! Missionen starten...`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap');

.font-work-sans {
  font-family: 'Work Sans', sans-serif;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
