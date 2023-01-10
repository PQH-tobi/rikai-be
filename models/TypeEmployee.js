const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeEmployeeSchema = new Schema({
    typeName: {
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

module.exports = mongoose.model('TypeEmployee', typeEmployeeSchema);
