const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        default: ''
    },
    sex: {
        type: Number,
        require: true
    },
    identificationNumber: {
        type: String,
        default: ''
    },
    birthDay: {
        type: Date,
        default: undefined
    },
    dateIn: {
        type: Date,
        required: true
    },
    dateOut: {
        type: Date,
        default: new Date(0)
    },
    department: {
        type: String,
        required: true
    },
    typeEmployee: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        require: true
    },
    deleteType: {
        type: String,
        default: '00'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
