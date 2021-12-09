const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    min: 0.0,
    required: true
  },
  experation: {
    type: Date,
    min: Date.now(),
    required: true
  },
  _shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop"
  }
});

mongoose.model('Food', foodSchema);