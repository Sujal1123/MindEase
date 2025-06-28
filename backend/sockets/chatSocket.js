const Message = require('../models/Message');
const mongoose = require('mongoose');

function chatSocket(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a chat room
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ roomId, senderId, receiverId, message }) => {
      try {
        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          throw new Error('Invalid sender or receiver ID');
        }

        console.log('📨 Incoming message payload:', { roomId, senderId, receiverId, message });

        const newMessage = new Message({
          roomId,
          senderId: new mongoose.Types.ObjectId(senderId),
          receiverId: new mongoose.Types.ObjectId(receiverId),
          message
        });

        const savedMessage = await newMessage.save();
        console.log('Message saved:', savedMessage);

        io.to(roomId).emit('receiveMessage', {
          _id: savedMessage._id,
          roomId: savedMessage.roomId,
          sender: savedMessage.senderId,
          receiver: savedMessage.receiverId,
          message: savedMessage.message,
          createdAt: savedMessage.createdAt
        });

      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = chatSocket;
