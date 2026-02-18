const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
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
        default: "Manager"
    },
    ProfileImage: {
        type: String
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("manager", managerSchema);