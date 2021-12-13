const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    _shopId: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    address: {
        type:String,
        required:true
    },
    coords: {
        type: [Number],
        index: '2dsphere'
    },
    days: {
        type: String,
        required: true
    },
    openingtime: {
        type: String,
        required: true
    },
    closingtime: {
        type: String,
        required: true
    },
    closed: {
        type: Boolean,
        required: true
    }
});

mongoose.model('Shop', shopSchema);