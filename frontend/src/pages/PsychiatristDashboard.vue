<template>
  <div class="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 min-h-screen">
    <h2 class="text-3xl font-semibold mb-4">Psychiatrist Dashboard</h2>
    <p class="text-lg mb-6">Welcome, Dr. {{ user.name }}</p>

    <div class="bg-white shadow rounded p-4">
      <h3 class="text-xl font-semibold mb-2">Your Patients</h3>
      <p v-if="patients.length === 0" class="text-gray-500">You haven't chatted with any patients yet.</p>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="patient in patients" :key="patient._id" class="py-3 flex justify-between items-center">
          <div>
            <p class="font-medium">{{ patient.name }}</p>
            <p class="text-sm text-gray-600">{{ patient.email }}</p>
          </div>
          <router-link :to="`/chat/${patient._id}`">
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Message
            </button>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user';
import API from '../services/api';

export default {
  setup() {
    const userStore = useUserStore();
    const user = userStore.user;
    const patients = ref([]);

    onMounted(async () => {
      try {
        const res = await API.get('/api/users/my-patients');
        patients.value = res.data;
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      }
    });

    return {
      user,
      patients
    };
  }
};
</script>

<style scoped>
h2, h3 {
  font-family: 'Inter', sans-serif;
}
</style>
