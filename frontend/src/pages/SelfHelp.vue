<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-6">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-indigo-700">🧠 Self-Help Resources</h1>
      <p class="text-gray-600 mt-2 text-lg">Support your well-being with expert content and mindfulness tools.</p>
    </div>

    <!-- Guided Meditations -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-indigo-600 mb-4">🌿 Guided Meditations</h2>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
          <iframe
            class="w-full h-64"
            src="https://www.youtube.com/embed/inpok4MKVLM"
            title="5-minute Meditation"
            allowfullscreen
          ></iframe>
        </div>
        <div class="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
          <iframe
            class="w-full h-64"
            src="https://www.youtube.com/embed/ZToicYcHIOU"
            title="Mindfulness Meditation"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- Exercises -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-indigo-600 mb-4">💪 Mindfulness Exercises</h2>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-white p-6 rounded-xl shadow hover:shadow-md border border-blue-100">
          <h3 class="font-semibold text-lg mb-2">📓 Daily Journaling</h3>
          <p class="text-gray-700">Write about one positive thing that happened today.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow hover:shadow-md border border-blue-100">
          <h3 class="font-semibold text-lg mb-2">🌬️ Breathing Exercise</h3>
          <p class="text-gray-700">Try the 4-7-8 technique: Inhale 4s, hold 7s, exhale 8s.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow hover:shadow-md border border-blue-100">
          <h3 class="font-semibold text-lg mb-2">🧘 Grounding Method</h3>
          <p class="text-gray-700">5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow hover:shadow-md border border-blue-100">
          <h3 class="font-semibold text-lg mb-2">🙏 Gratitude List</h3>
          <p class="text-gray-700">List 3 things you're thankful for today.</p>
        </div>
      </div>
    </section>

    <!-- Expert Articles -->
    <section>
      <h2 class="text-2xl font-bold text-indigo-600 mb-4">📚 Expert Articles</h2>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-white p-6 rounded-xl shadow border border-blue-100 hover:shadow-md transition">
          <h3 class="text-lg font-semibold text-indigo-700 mb-2">Understanding Anxiety</h3>
          <p class="text-gray-700 mb-2">Learn to identify triggers and how to calm your mind during episodes.</p>
          <a href="https://www.helpguide.org/articles/anxiety/anxiety-disorders-and-anxiety-attacks.htm" target="_blank" class="text-blue-500 underline">Read more</a>
        </div>
        <div class="bg-white p-6 rounded-xl shadow border border-blue-100 hover:shadow-md transition">
          <h3 class="text-lg font-semibold text-indigo-700 mb-2">Practicing Self-Compassion</h3>
          <p class="text-gray-700 mb-2">Science-backed strategies for being kinder to yourself during hard times.</p>
          <a href="https://self-compassion.org" target="_blank" class="text-blue-500 underline">Explore</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SelfHelp'
}
</script>
