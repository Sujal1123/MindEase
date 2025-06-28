<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4">
    <div class="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">My Profile</h2>

      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Name</label>
          <input v-model="form.name" class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input v-model="form.email" disabled class="w-full px-4 py-2 bg-gray-100 border rounded-md text-gray-500" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Age</label>
          <input v-model="form.age" type="number" class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block mb-1 font-medium">Location</label>
          <input v-model="form.location" class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>

        <button
          type="submit"
          class="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import API from '../services/api';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const form = ref({
      name: '',
      email: '',
      age: '',
      location: ''
    });

    const loadProfile = async () => {
      const res = await API.get('/api/users/me');
      Object.assign(form.value, res.data);
    };

    const updateProfile = async () => {
      await API.put('/api/users/me', form.value);
      router.push('/');
      alert('Profile updated!');
    };

    onMounted(loadProfile);

    return { form, updateProfile };
  }
}
</script>
