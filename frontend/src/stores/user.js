import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  const loadUser = async () => {
    const stored = localStorage.getItem('user')
    if (stored && stored !== 'undefined') {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.token) {
          user.value = parsed
          isLoggedIn.value = true
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse user:', e)
      }
    }
    user.value = null
    isLoggedIn.value = false
    return null
  }

  const setUser = (u) => {
    user.value = u
    isLoggedIn.value = !!u?.token
    localStorage.setItem('user', JSON.stringify(u))
  }

  const logout = () => {
    localStorage.removeItem('user')
    user.value = null
    isLoggedIn.value = false
  }

  return {
    user,
    isLoggedIn,
    loadUser,
    setUser,
    logout
  }
})
