<template>
  <div class="p-6 max-w-3xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 min-h-screen">
    <h2 class="text-3xl font-bold mb-6 text-center text-white">Posts</h2>

    <!-- Create Post -->
    <form
      v-if="user?.role === 'psychiatrist'"
      @submit.prevent="submitPost"
      class="mb-10 space-y-4 bg-white p-6 rounded shadow"
    >
      <input v-model="title" placeholder="Title" class="w-full border px-4 py-2 rounded" />
      <textarea v-model="content" placeholder="Write something helpful..." class="w-full border px-4 py-2 rounded" rows="5" />

      <!-- 🌟 Styled Image Upload -->
      <div>
        <label class="block font-medium mb-1">Attach an image (optional)</label>
        <label
          class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition duration-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
        >
          <svg class="w-10 h-10 mb-2 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5m-4-4L12 4m0 0L8 8m4-4v12" />
          </svg>
          <span class="text-sm text-gray-600">Click to upload or drag & drop</span>
          <input type="file" @change="handleImage" class="hidden" />
        </label>
      </div>

      <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Post</button>
    </form>

    <!-- Show Posts -->
    <div v-for="post in posts" :key="post._id" class="relative bg-white shadow-md rounded-lg p-6 mb-6">
      <!-- Delete Button -->
      <button
        v-if="user?.role === 'psychiatrist' && post.author && user._id === post.author._id"
        @click="deletePost(post._id)"
        class="absolute top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Delete
      </button>

      <h3 class="text-xl font-semibold text-gray-800">{{ post.title }}</h3>
      <p class="text-sm text-gray-600 mb-2">
        by {{ post.author?.name || 'Anonymous' }} • {{ new Date(post.createdAt).toLocaleDateString() }}
      </p>

      <!-- Post Image with Modal Trigger -->
      <img
        v-if="post.image"
        :src="`http://localhost:5000${post.image}`"
        class="w-full h-64 object-cover rounded mb-3 cursor-pointer hover:opacity-90 transition"
        @click="openImageModal(`http://localhost:5000${post.image}`)"
      />

      <p class="text-gray-700 whitespace-pre-line mb-4">{{ post.content }}</p>

      <!-- Actions -->
      <div class="flex items-center space-x-4 text-sm mb-3">
        <button @click="toggleLike(post)" class="flex items-center space-x-1">
          <span>❤️</span>
          <span>{{ post.likes.length }}</span>
        </button>
        <button @click="post.showComment = !post.showComment" class="flex items-center space-x-1">
          <span>💬</span>
          <span>{{ post.comments.length }}</span>
        </button>
        <button @click="sharePost(post)" class="flex items-center space-x-1">
          🔗 Share
        </button>
      </div>

      <!-- Comments -->
      <div v-if="post.showComment" class="bg-gray-50 rounded p-3 space-y-2">
        <div v-for="comment in post.comments" :key="comment._id" class="text-sm">
          <strong>{{ comment.user?.name || 'Anonymous' }}:</strong> {{ comment.text }}
        </div>
        <input
          v-model="commentText"
          @keyup.enter="submitComment(post._id)"
          placeholder="Add a comment..."
          class="w-full border px-2 py-1 rounded mt-2"
        />
      </div>
    </div>

    <!-- 🔍 Image Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <img :src="selectedImage" class="max-h-full max-w-full object-contain rounded shadow-lg" />
      <button
        @click.stop="closeImageModal"
        class="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import API from '../services/api';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const title = ref('');
    const content = ref('');
    const posts = ref([]);
    const imageFile = ref(null);
    const commentText = ref('');
    const selectedImage = ref(null);
    const showImageModal = ref(false);

    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);

    const fetchPosts = async () => {
      try {
        const res = await API.get('/api/posts');
        posts.value = res.data.map((post) => ({ ...post, showComment: false }));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const handleImage = (e) => {
      imageFile.value = e.target.files[0];
    };

    const submitPost = async () => {
      try {
        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('content', content.value);
        if (imageFile.value) formData.append('image', imageFile.value);

        const res = await API.post('/api/posts', formData, {
          headers: {
            Authorization: `Bearer ${user.value.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        posts.value.unshift({ ...res.data, showComment: false });
        title.value = '';
        content.value = '';
        imageFile.value = null;
      } catch (error) {
        console.error('Post creation failed:', error);
        alert('Failed to create post.');
      }
    };

    const deletePost = async (postId) => {
      if (!confirm('Are you sure you want to delete this post?')) return;

      try {
        await API.delete(`/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${user.value.token}` },
        });
        posts.value = posts.value.filter((p) => p._id !== postId);
      } catch (error) {
        alert('Failed to delete post');
        console.error(error);
      }
    };

    const toggleLike = async (post) => {
      try {
        await API.post(`/api/posts/${post._id}/like`, {}, {
          headers: { Authorization: `Bearer ${user.value.token}` },
        });
        await fetchPosts();
      } catch (error) {
        alert('Failed to like post');
        console.error(error);
      }
    };

    const submitComment = async (postId) => {
      if (!commentText.value.trim()) return;

      try {
        await API.post(`/api/posts/${postId}/comment`, { text: commentText.value }, {
          headers: { Authorization: `Bearer ${user.value.token}` },
        });
        commentText.value = '';
        await fetchPosts();
      } catch (error) {
        alert('Failed to comment');
        console.error(error);
      }
    };

    const sharePost = (post) => {
      const url = `${window.location.origin}/posts/${post._id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('Post link copied to clipboard!');
      });
    };

    const openImageModal = (imageUrl) => {
      selectedImage.value = imageUrl;
      showImageModal.value = true;
    };

    const closeImageModal = () => {
      selectedImage.value = null;
      showImageModal.value = false;
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      title,
      content,
      posts,
      handleImage,
      submitPost,
      deletePost,
      toggleLike,
      submitComment,
      commentText,
      sharePost,
      user,
      selectedImage,
      showImageModal,
      openImageModal,
      closeImageModal,
    };
  },
};
</script>

<style>
input::placeholder,
textarea::placeholder {
  color: #94a3b8;
}
</style>
