const mongoose = require('mongoose');

const dbconnect = () => {
    mongoose.connect("mongodb+srv://heettalaviya:Heet701652@cluster0.wrlse7q.mongodb.net/blog")
        .then(() => console.log(' DB is connected successfully'))
        .catch((err) => console.log(err))
}

module.exports = dbconnect;