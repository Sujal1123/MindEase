<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

      <form @submit.prevent="login" class="space-y-4">
        <input v-model="email" class="w-full px-4 py-2 border rounded-md" placeholder="Email" />
        <input v-model="password" type="password" class="w-full px-4 py-2 border rounded-md" placeholder="Password" />

        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import API from '../services/api'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const userStore = useUserStore()

    const login = async () => {
  try {
    const res = await API.post('/api/auth/login', {
      email: email.value,
      password: password.value
    });

    console.log('Login successful:', res.data);

    const userWithToken = { ...res.data.user, token: res.data.token };

    localStorage.setItem('token', res.data.token);

    userStore.setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));

    router.push('/');
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    alert('Invalid email or password');
  }
};


    return { email, password, login }
  }
}
</script>
