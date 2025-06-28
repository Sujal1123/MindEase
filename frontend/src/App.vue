<template>
  <div class="bg-gradient-to-r from-indigo-600 to-purple-600">
    <!-- Navbar -->
    <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="text-2xl font-bold tracking-tight hover:opacity-90 transition duration-200">
            🌿 MindEase
          </router-link>

          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-6 items-center">
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="hover:text-yellow-200 transition font-medium">Login</router-link>
              <router-link to="/signup" class="bg-yellow-300 text-black px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-400 transition">
                Sign Up
              </router-link>
            </template>

            <template v-else>
              <router-link
                v-if="user.role === 'patient'"
                to="/explore"
                class="hover:text-yellow-200 transition font-medium"
              >
                Explore
              </router-link>
              <router-link to="/self-help" class="hover:underline block py-2 hover:text-yellow-300">Self-Help</router-link>
              <router-link to="/posts" class="hover:underline block py-2 hover:text-yellow-300">Posts</router-link>
              <router-link
                v-if="user.role === 'psychiatrist'"
                to="/dashboard"
                class="hover:text-yellow-200 transition font-medium"
              >
                Dashboard
              </router-link>
              <router-link
                to="/account"
                class="bg-white text-indigo-700 px-4 py-1.5 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Account
              </router-link>
              <button
                @click="handleLogout"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full font-medium transition"
              >
                Logout
              </button>
            </template>
          </div>

          <!-- Mobile Menu Toggle -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden px-6 pb-4">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="block py-2 hover:text-yellow-300">Login</router-link>
          <router-link to="/signup" class="block py-2 hover:text-yellow-300">Sign Up</router-link>
        </template>

        <template v-else>
          <router-link
            v-if="user.role === 'patient'"
            to="/explore"
            class="block py-2 hover:text-yellow-300"
          >
            Explore
          </router-link>
          <router-link to="/self-help" class="hover:underline block py-2 hover:text-yellow-300">Self-Help</router-link>
          <router-link to="/posts" class="hover:underline block py-2 hover:text-yellow-300">Posts</router-link>
          <router-link
            v-if="user.role === 'psychiatrist'"
            to="/dashboard"
            class="block py-2 hover:text-yellow-300"
          >
            Dashboard
          </router-link>
          <router-link to="/account" class="block py-2 hover:text-yellow-300">Account</router-link>
          <button @click="handleLogout" class="block text-red-200 py-2 hover:text-red-400">Logout</button>
        </template>
      </div>
    </nav>

    <!-- Router View -->
    <router-view class="px-4 md:px-10 mt-6" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'
import { storeToRefs } from 'pinia'

export default {
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const { user, isLoggedIn } = storeToRefs(userStore)
    const mobileMenuOpen = ref(false)

    onMounted(() => {
      userStore.loadUser()
    })

    const handleLogout = () => {
      userStore.logout()
      router.push('/login')
    }

    return {
      user,
      isLoggedIn,
      handleLogout,
      mobileMenuOpen
    }
  }
}
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
  scroll-behavior: smooth;
}
</style>
