const mongoose = require('mongoose');
const ClientSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter proper name'],
    },
    amount:{
        type: String,
        required: [true, 'Please enter amount'],
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
    },
    phone_number:{
        type: String,
        required: [true, 'Please enter phone number'],
    },
    select_type:{
        type: String,
        required: [true, 'Please enter type'],
    },
    date:{
        type: String,
        required: [true, 'Select enter Date'],
    },
    schemes:{
        type: String,
        required: [true, 'Please enter schemes'],
    },
    createdAt: { type: Date, default: Date.now } // Default timestamp

    
});

module.exports = mongoose.model('clients', ClientSchema);
