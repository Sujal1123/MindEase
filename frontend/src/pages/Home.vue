<template>
  <div class="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
    <!-- Hero Section with Background -->
    <section
      class="relative bg-cover bg-center text-black py-40 px-6 text-center"
      style="background-image: url('/therapy-bg.jpg');"
    >
      <div class="absolute inset-0  bg-opacity-50"></div>
      <div class="relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Your Mental Health Matters</h1>
        <p class="text-lg md:text-xl mb-6 drop-shadow-md">
          We’re here to support your journey to better mental well-being.
        </p>
        <router-link to="/explore">
          <button class="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded shadow transition">
            Find a Psychiatrist
          </button>
        </router-link>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16 px-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">What We Offer</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 class="text-xl font-semibold mb-2">1-on-1 Counseling</h3>
          <p class="text-gray-600">Connect with licensed professionals for private, personalized therapy sessions.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 class="text-xl font-semibold mb-2">Chat Support</h3>
          <p class="text-gray-600">Message your psychiatrist securely at any time for continuous support.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 class="text-xl font-semibold mb-2">Self-Help Resources</h3>
          <p class="text-gray-600">Explore meditations, exercises, and expert-written content to manage stress.</p>
        </div>
      </div>
    </section>


    <!-- Testimonials Section -->
    <section class="bg-indigo-50 py-16 px-6">
      <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">What Our Users Say</h2>
      <div class="max-w-4xl mx-auto space-y-6 text-center text-gray-700">
        <blockquote class="italic">"This platform has been a lifesaver. I finally feel heard and supported."</blockquote>
        <blockquote class="italic">"The ability to chat with my therapist at any time makes a big difference."</blockquote>
      </div>
    </section>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
export default {
  name: 'Home',
};
</script>
