// models/Route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  startLocation: {
    type: String,
    required: true, // Starting point of the route
  },
  endLocation: {
    type: String,
    required: true, // Ending point of the route
  },
  stops: [
    {
      name: { type: String, required: true },
      
    },
  ],
});

const routeModel = mongoose.model('Route', routeSchema)

module.exports = routeModel
