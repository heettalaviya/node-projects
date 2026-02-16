const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
        default: "user"
    },
    ProfileImage: {
        type: String
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model("user", userSchema);