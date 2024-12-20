const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    managers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: false
    }
});

const DepartmentModel = mongoose.model('departments', DepartmentSchema, 'departments');
module.exports = DepartmentModel;