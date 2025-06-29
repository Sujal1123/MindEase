<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Account Settings</h2>

    <!-- Profile Image Preview -->
    <div class="mb-6 text-center">
      <img
  :src="getImageUrl(form.profileImage)"
  alt="Profile Image"
  class="w-full h-48 object-cover object-top rounded-md mb-3"
/>



    </div>

    <!-- Account Update Form -->
    <form @submit.prevent="updateAccount" class="space-y-5">
      <div>
        <label class="block font-medium mb-1">Name</label>
        <input v-model="form.name" class="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300" />
      </div>

      <div>
        <label class="block font-medium mb-1">Email</label>
        <input v-model="form.email" class="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-300" />
      </div>

      <!-- Stylish Upload -->
      <div>
        <label class="block font-medium mb-1">Upload Profile Image</label>
        <label
          class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
        >
          <svg class="w-10 h-10 mb-2 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5m-4-4L12 4m0 0L8 8m4-4v12" />
          </svg>
          <span class="text-sm text-gray-600">Click to upload or drag & drop</span>
          <input type="file" @change="handleImageUpload" class="hidden" />
        </label>
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>

    <hr class="my-6" />

    <button
      @click="deleteAccount"
      class="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100 mt-4"
    >
      Delete My Account
    </button>
  </div>
</template>

<script>
import API from '../services/api'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const form = ref({ name: '', email: '', profileImage: '' })
    const router = useRouter()

    const loadUser = async () => {
      try {
        const res = await API.get('/api/users/me')
        form.value.name = res.data.name;
form.value.email = res.data.email;

const rawPath = res.data.profileImage || '';
form.value.profileImage = rawPath.startsWith('http') 
  ? rawPath 
  : `/uploads/${rawPath.split('/').pop()}`;


      } catch (err) {
        console.error('Failed to fetch user info:', err)
      }
    }

    const updateAccount = async () => {
      try {
        await API.put('/api/users/me', {
          name: form.value.name,
          email: form.value.email
        })
        alert('Profile updated successfully!')
        const current = JSON.parse(localStorage.getItem('user'))
        localStorage.setItem('user', JSON.stringify({ ...current, ...form.value }))
      } catch (err) {
        console.error('Error updating account:', err)
        alert('Failed to update account.')
      }
    }

    const handleImageUpload = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('profileImage', file)

      try {
        const res = await API.put('/api/users/me/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        form.value.profileImage = res.data.profileImage
        alert('Image uploaded!')
      } catch (err) {
        console.error('Image upload failed:', err)
        alert('Image upload failed.')
      }
    }

    const deleteAccount = async () => {
      if (!confirm('Are you sure? This action cannot be undone.')) return
      try {
        await API.delete('/api/users/me')
        localStorage.removeItem('user')
        router.push('/login')
        location.reload()
      } catch (err) {
        console.error('Error deleting account:', err)
        alert('Failed to delete account.')
      }
    }

    const getImageUrl = (path) => {
  if (!path) return '/default-avatar.png';
  return path.startsWith('http') ? path : `https://mindease-production-ed22.up.railway.app${path}`;
};


   onMounted(async () => {
  await loadUser();
  console.log('Resolved profile image URL:', getImageUrl(form.value.profileImage));
});



    return {
      form,
      updateAccount,
      deleteAccount,
      handleImageUpload,
      getImageUrl
    }
  }
}
</script>
