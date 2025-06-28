<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      <form @submit.prevent="signup" class="space-y-4">
        <div>
          <input v-model="name" class="w-full px-4 py-2 border rounded-md" placeholder="Name" />
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>

        <div>
          <input v-model="email" class="w-full px-4 py-2 border rounded-md" placeholder="Email" />
          <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>

        <div>
          <input v-model="password" type="password" class="w-full px-4 py-2 border rounded-md" placeholder="Password" />
          <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
        </div>

        <div>
          <select v-model="role" class="w-full px-4 py-2 border rounded-md">
            <option disabled value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="psychiatrist">Psychiatrist</option>
          </select>
          <p v-if="errors.role" class="text-red-500 text-sm">{{ errors.role }}</p>
        </div>

        <!-- Psychiatrist Only Fields -->
        <div v-if="role === 'psychiatrist'" class="space-y-3 border-t pt-4 mt-4">
          <div>
            <input v-model="specializations" class="w-full px-4 py-2 border rounded-md" placeholder="Specializations (comma-separated)" />
            <p v-if="errors.specializations" class="text-red-500 text-sm">{{ errors.specializations }}</p>
          </div>

          <div>
            <input v-model="experienceYears" class="w-full px-4 py-2 border rounded-md" placeholder="Years of Experience(only in numbers)" />
            <p v-if="errors.experienceYears" class="text-red-500 text-sm">{{ errors.experienceYears }}</p>
          </div>

          <div>
            <input v-model="location" class="w-full px-4 py-2 border rounded-md" placeholder="Location" />
            <p v-if="errors.location" class="text-red-500 text-sm">{{ errors.location }}</p>
          </div>

          <div>
            <textarea v-model="bio" rows="3" class="w-full px-4 py-2 border rounded-md" placeholder="Short Bio"></textarea>
            <p v-if="errors.bio" class="text-red-500 text-sm">{{ errors.bio }}</p>
          </div>

          <!-- 🌟 Styled Image Upload -->
          <div>
            <label class="block font-medium mb-1">Profile Image</label>
            <label
              class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
            >
              <svg class="w-10 h-10 mb-2 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.5"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5m-4-4L12 4m0 0L8 8m4-4v12" />
              </svg>
              <span class="text-sm text-gray-600">Click to upload or drag & drop</span>
              <input type="file" @change="handleImage" accept="image/*" class="hidden" />
            </label>
            <p v-if="errors.profileImage" class="text-red-500 text-sm">{{ errors.profileImage }}</p>
          </div>
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import API from '../services/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default {
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const role = ref('')
    const specializations = ref('')
    const experienceYears = ref('')
    const location = ref('')
    const bio = ref('')
    const profileImage = ref(null)
    const errors = ref({})

    const router = useRouter()
    const userStore = useUserStore()

    const handleImage = (e) => {
      profileImage.value = e.target.files[0]
    }

    const validate = () => {
      errors.value = {}

      if (!name.value.trim()) errors.value.name = 'Name is required'
      if (!email.value.trim()) errors.value.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(email.value)) errors.value.email = 'Invalid email format'
      if (!password.value) errors.value.password = 'Password is required'
      else if (password.value.length < 6) errors.value.password = 'Password must be at least 6 characters'
      if (!role.value) errors.value.role = 'Role is required'

      if (role.value === 'psychiatrist') {
        if (!specializations.value.trim()) errors.value.specializations = 'Specializations required'
        if (!experienceYears.value.trim()) errors.value.experienceYears = 'Experience is required'
        if (!location.value.trim()) errors.value.location = 'Location is required'
        if (!bio.value.trim()) errors.value.bio = 'Bio is required'
        if (!profileImage.value) errors.value.profileImage = 'Profile image is required'
      }

      return Object.keys(errors.value).length === 0
    }

    const signup = async () => {
      if (!validate()) return

      try {
        const formData = new FormData()
        formData.append('name', name.value)
        formData.append('email', email.value)
        formData.append('password', password.value)
        formData.append('role', role.value)

        if (role.value === 'psychiatrist') {
          formData.append('specializations', specializations.value)
          formData.append('experienceYears', experienceYears.value)
          formData.append('location', location.value)
          formData.append('bio', bio.value)
          formData.append('profileImage', profileImage.value)
        }

        const res = await API.post('/api/auth/signup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userWithToken = { ...res.data.user, token: res.data.token }
        userStore.setUser(userWithToken)
        router.push('/explore')
      } catch (err) {
        console.error('Signup error:', err)
        alert('Signup failed. Please try again.')
      }
    }

    return {
      name,
      email,
      password,
      role,
      specializations,
      experienceYears,
      location,
      bio,
      profileImage,
      handleImage,
      signup,
      errors
    }
  }
}
</script>
