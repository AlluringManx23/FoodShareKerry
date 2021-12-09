const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    _shopId: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    address: String,
    coords: {
        type: [Number],
        index: '2dsphere'
    },
    days: {
        type: String,
        required: true
    },
    openingtime: String,
    closingtime: String,
    closed: {
        type: Boolean,
        required: true
    }
});

mongoose.model('Shop', shopSchema);