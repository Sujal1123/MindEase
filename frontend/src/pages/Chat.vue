<template>
  <div class="flex flex-col h-screen" v-if="!isSelfChat">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-4 px-6 text-xl font-bold flex justify-between items-center">
      <span>Chat</span>
      <span v-if="receiverUser">{{ receiverUser.name }}</span>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-100">
      <div v-for="(group, date) in groupedMessages" :key="date">
        <div class="text-center text-sm text-gray-500 mb-2 font-medium">
          {{ formatDay(date) }}
        </div>
        <div
          v-for="msg in group"
          :key="msg._id"
          :class="isSentByMe(msg) ? 'text-right' : 'text-left'"
        >
          <div
            :class="[
              'inline-block px-4 py-2 rounded max-w-xs break-words',
              isSentByMe(msg) ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            ]"
          >
            {{ msg.message }}
            <div class="text-xs text-gray-300 mt-1">
              {{ formatTimeIST(msg.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <form @submit.prevent="sendMessage" class="flex border-t p-4 bg-white">
      <input
        v-model="newMessage"
        class="flex-1 border rounded px-4 py-2 mr-2"
        placeholder="Type a message"
        required
      />
      <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Send
      </button>
    </form>
  </div>

  <!-- Self Chat Error -->
  <div v-else class="flex items-center justify-center h-screen text-red-600 text-xl font-semibold">
    You cannot chat with yourself.
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import API from '../services/api'
import socket from '../services/socket'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
dayjs.extend(isToday)
dayjs.extend(isYesterday)

export default {
  setup() {
    const route = useRoute()
    const receiverId = route.params.id

    const currentUser = ref({})
    const receiverUser = ref({})
    const roomId = ref('')
    const messages = ref([])
    const newMessage = ref('')
    const isSelfChat = ref(false)

    const isSentByMe = (msg) => msg.senderId === currentUser.value._id

    const formatTimeIST = (isoTime) => {
      const date = new Date(isoTime)
      return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    const groupedMessages = computed(() => {
      const groups = {}
      messages.value.forEach(msg => {
        const key = dayjs(msg.createdAt).format('YYYY-MM-DD')
        if (!groups[key]) groups[key] = []
        groups[key].push(msg)
      })
      return groups
    })

    const formatDay = (dateString) => {
      const d = dayjs(dateString)
      if (d.isToday()) return 'Today'
      if (d.isYesterday()) return 'Yesterday'
      return d.format('D MMM YYYY')
    }

    onMounted(async () => {
      try {
        const stored = localStorage.getItem('user')
        if (!stored || stored === 'undefined') throw new Error('Not logged in')
        currentUser.value = JSON.parse(stored)

        if (!currentUser.value._id || !receiverId) throw new Error('Missing IDs')
        if (currentUser.value._id === receiverId) {
          isSelfChat.value = true
          return
        }

        roomId.value = [currentUser.value._id, receiverId].sort().join('_')
        socket.emit('joinRoom', { roomId: roomId.value })

        const res = await API.get('/api/chat/messages', {
          params: { userId1: currentUser.value._id, userId2: receiverId }
        })
        messages.value = res.data.map(m => ({
          ...m,
          senderId: m.senderId || (m.sender?._id || m.sender)
        }))

        const rec = await API.get(`/api/users/${receiverId}`)
        receiverUser.value = rec.data

        socket.off('receiveMessage')
        socket.on('receiveMessage', (m) => {
          messages.value.push({
            ...m,
            senderId: m.senderId || (m.sender?._id || m.sender)
          })
        })
      } catch (e) {
        console.error(e.message)
      }
    })

    onBeforeUnmount(() => {
      socket.off('receiveMessage')
    })

    const sendMessage = () => {
      if (!newMessage.value.trim()) return
      socket.emit('sendMessage', {
        roomId: roomId.value,
        senderId: currentUser.value._id,
        receiverId,
        message: newMessage.value
      })
      newMessage.value = ''
    }

    return {
      messages,
      newMessage,
      sendMessage,
      isSelfChat,
      isSentByMe,
      receiverUser,
      formatTimeIST,
      groupedMessages,
      formatDay
    }
  }
}
</script>
