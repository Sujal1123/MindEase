<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-semibold mb-2">Explore Psychiatrists</h2>
    <p v-if="user" class="text-lg mb-6">Welcome, {{ user.name }}</p>

    <!-- 🔍 Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name..."
        class="w-full max-w-md px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <!-- 👥 Psychiatrist Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
  v-for="psychiatrist in filteredPsychiatrists"
  :key="psychiatrist._id"
  class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
>
  <!-- Profile Image -->
  <div class="h-52 w-full overflow-hidden">
    <img
  v-if="psychiatrist.profileImage"
  :src="`https://mindease-production-ed22.up.railway.app/uploads/${psychiatrist.profileImage}`"
  alt="Profile Image"
  class="w-full h-48 object-cover object-top rounded-md mb-3"
/>

    <img
  v-else
  src="/default-avatar.png"
  alt="Default Avatar"
  class="w-full h-48 object-cover object-top rounded-md mb-3"
/>

  </div>

  <!-- Info -->
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800">{{ psychiatrist.name }}</h3>
    <p class="text-sm text-gray-600">{{ psychiatrist.email }}</p>
    <p class="mt-2 text-sm text-gray-700">
      <strong>Specializations:</strong>
      {{ psychiatrist.specializations.join(', ') }}
    </p>

    <router-link :to="`/profile/${psychiatrist._id}`">
      <button class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        View Profile
      </button>
    </router-link>
  </div>
</div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'
import API from '../services/api.js'

export default {
  setup() {
    const psychiatrists = ref([])
    const searchQuery = ref('')
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    onMounted(async () => {
      await userStore.loadUser()
      console.log('User in Explore.vue:', user.value)

      try {
        const res = await API.get('/api/users/psychiatrists')
        psychiatrists.value = res.data
      } catch (err) {
        console.error('Failed to fetch psychiatrists:', err)
        alert('You must be logged in to explore psychiatrists.')
      }
    })

    const filteredPsychiatrists = computed(() => {
      return psychiatrists.value.filter(p =>
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    return {
      psychiatrists,
      searchQuery,
      filteredPsychiatrists,
      user
    }
  }
}
</script>
