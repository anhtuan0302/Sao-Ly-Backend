const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

const DepartmentModel = mongoose.model('departments', DepartmentSchema, 'departments');
module.exports = DepartmentModel;