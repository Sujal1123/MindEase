const User = require('../models/User');
const Message = require('../models/Message');

exports.getPsychiatrists = async (req, res) => {
  const { specialization, location } = req.query;
  const filter = { role: 'psychiatrist' };

  if (specialization) {
    filter.specializations = { $in: [specialization] };
  }
  if (location) {
    filter.location = location;
  }

  try {
    const psychiatrists = await User.find(filter).select('-passwordHash');

    const baseUrl = 'https://mindease-production-ed22.up.railway.app';

    const psychiatristsWithFullImage = psychiatrists.map(p => {
      const user = p.toObject();
      if (user.profileImage) {
        user.profileImage = `${baseUrl}${user.profileImage.startsWith('/') ? '' : '/'}${user.profileImage}`;
      }
      return user;
    });

    res.json(psychiatristsWithFullImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyPatients = async (req, res) => {
  try {
    const psychiatristId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: psychiatristId },
        { receiverId: psychiatristId }
      ]
    });

    const patientIds = new Set();
    for (const msg of messages) {
      if (msg.senderId.toString() !== psychiatristId) {
        patientIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== psychiatristId) {
        patientIds.add(msg.receiverId.toString());
      }
    }

    const patients = await User.find({ _id: { $in: Array.from(patientIds) }, role: 'patient' }).select('-passwordHash');

    const baseUrl = 'https://mindease-production-ed22.up.railway.app';
    const patientsWithFullImage = patients.map(p => {
      const user = p.toObject();
      if (user.profileImage) {
        user.profileImage = `${baseUrl}${user.profileImage.startsWith('/') ? '' : '/'}${user.profileImage}`;
      }
      return user;
    });

    res.json(patientsWithFullImage);
  } catch (error) {
    console.error('Error in getMyPatients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
