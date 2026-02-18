const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
        default: "Admin"
    },
    ProfileImage: {
        type: String
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model("admin", adminSchema);