// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus', // References the Bus model
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // References the Route model
    required: true,
  },
  direction: {
    type: String,
    enum: ['forward', 'backward'], // Indicates Start to End or End to Start
    required: true,
  },
  stopTimes: [
    {
      stopName: { type: String, required: true },
      arrivalTime: { type: Date, required: true }, // Expected arrival time at each stop
    },
  ],
});

const scheduleModel = mongoose.model('Schedule', scheduleSchema)

module.exports = scheduleModel
