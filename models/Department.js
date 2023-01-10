const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    nameDepartment: {
        type: String,
        require: true
    },
    shortName: {
        type: String,
        require: true
    },
    deleteType: {
        type: String,
        default: '00'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
