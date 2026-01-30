const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ["Technology", "education", "CareerGuidance"],
        default: "Technology"
    },
    blogimage: {
        type: String
    },
    authorname: {
        type: String
    },
    authorImage: {
        type: String
    },
    publishDate: {
        type: Date
    }
});

module.exports = mongoose.model('blog', blogSchema);