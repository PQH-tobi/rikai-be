const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    nameUser: {
        type: String,
        require: true,
    },
    Age: {
        type: Number,
        require: true,
    },
    Role: {
        type: String,
        require: true,
    },
    deleteType: {
        type: String,
        default: '00'
    },
    gmail:{
        type: String,
        require: true,
    },
    numberPhone: {
        type: String,
        require: true,
    },
    role:{
        type: String,
        require: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);