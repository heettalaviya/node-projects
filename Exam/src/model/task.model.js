const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String
    },
    description: {
        type: String
    },
    taskImage:{
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("task", taskSchema);
