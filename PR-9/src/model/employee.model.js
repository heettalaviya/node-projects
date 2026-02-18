const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({

    Firstname: {
        type: String
    },
    Lastname: {
        type: String
    },
    Email: {
        type: String
    },
    Passsword: {
        type: String
    },
    Gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    MoblieNo: {
        type: Number
    },
    Role: {
        type: String,
        default: "Employee"
    },
    ProfileImage: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "createdByModel"
    },
    createdByModel: {
        type: String,
        enum: ["admin", "manager"]
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "updatedByModel"
    },
    updatedByModel: {
        type: String,
        enum: ["admin", "manager"]
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('employee', employeeSchema);