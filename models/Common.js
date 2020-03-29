const mongoose = require('mongoose');
const CommonSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  profilePicture: {
    type: String,
    required: true
  }
  /*name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
  },
  aadhar: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }*/
});

module.exports = mongoose.model('common', CommonSchema);