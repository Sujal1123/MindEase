<template>
  <div v-if="psychiatrist" class="max-w-3xl mx-auto bg-white shadow rounded-2xl p-8 mt-8">
    <!-- Psychiatrist Info -->
    <div class="mb-6 space-y-2">
      <h2 class="text-3xl font-bold text-blue-700">{{ psychiatrist.name }}</h2>

      <img
        v-if="psychiatrist.profileImage"
        :src="`http://localhost:5000${psychiatrist.profileImage}`"
        alt="Profile Image"
        class="w-32 h-32 rounded-full object-cover border shadow"
      />

      <p class="text-gray-700"><strong>Email:</strong> {{ psychiatrist.email }}</p>

      <p class="text-gray-700" v-if="psychiatrist.specializations?.length">
        <strong>Specializations:</strong> {{ psychiatrist.specializations.join(', ') }}
      </p>

      <p class="text-gray-700" v-if="psychiatrist.experienceYears">
        <strong>Experience:</strong> {{ psychiatrist.experienceYears }} years
      </p>

      <p class="text-gray-700" v-if="psychiatrist.location">
        <strong>Location:</strong> {{ psychiatrist.location }}
      </p>

      <p class="text-gray-700" v-if="psychiatrist.bio">
        <strong>Bio:</strong> {{ psychiatrist.bio }}
      </p>

      <p class="text-gray-700">
        <strong>Average Rating:</strong> {{ averageRating }}
      </p>
    </div>

    <!-- Leave a Review -->
    <div class="mt-10">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Leave a Review</h3>
      <form @submit.prevent="submitReview" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Rating</label>
          <select v-model="newRating" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option disabled value="">Rate</option>
            <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Comment</label>
          <textarea v-model="newComment" rows="4" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Submit Review
        </button>
      </form>
    </div>

    <!-- Reviews Section -->
    <div class="mt-10">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
      <div v-for="review in reviews" :key="review._id" class="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <p class="font-semibold text-gray-700">
          {{ review.patient.name }} rated <span class="text-yellow-500">{{ review.rating }}★</span>
        </p>
        <p class="text-gray-600 mt-1">{{ review.comment }}</p>
      </div>
    </div>

    <!-- Chat Button -->
    <div class="mt-8 text-right">
      <router-link :to="`/chat/${psychiatrist._id}`">
        <button class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
          Start Chat
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import API from '../services/api';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const psychiatrist = ref(null);
    const reviews = ref([]);
    const newRating = ref('');
    const newComment = ref('');
    const route = useRoute();

    const averageRating = computed(() => {
      if (!reviews.value.length) return 'No ratings yet';
      const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
      return (sum / reviews.value.length).toFixed(1);
    });

    const fetchReviews = async () => {
      const res = await API.get(`/api/reviews/${route.params.id}`);
      reviews.value = res.data;
    };

    const submitReview = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to leave a review.');
        return;
      }

      try {
        await API.post('/api/reviews', {
          psychiatristId: route.params.id,
          rating: newRating.value,
          comment: newComment.value
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        newRating.value = '';
        newComment.value = '';
        fetchReviews();
      } catch (err) {
        console.error('Failed to submit review:', err);
        alert('Failed to submit review.');
      }
    };

    onMounted(async () => {
      const id = route.params.id;
      if (!id) {
        console.warn('No psychiatrist ID in route');
        return;
      }

      try {
        const res = await API.get(`/api/users/${id}`);
        psychiatrist.value = res.data;
        fetchReviews();
      } catch (err) {
        console.error('Failed to load psychiatrist profile', err);
      }
    });

    return {
      psychiatrist,
      reviews,
      newRating,
      newComment,
      submitReview,
      averageRating
    };
  }
};
</script>
