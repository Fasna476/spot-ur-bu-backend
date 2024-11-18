// models/Bus.js
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['KSRTC', 'Local', 'LimitedStop'],
    required: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // References the Route model
    required: true,
  },
});

const busModel = mongoose.model('Bus', busSchema)

module.exports = busModel
