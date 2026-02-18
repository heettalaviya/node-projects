const mongoose = require('mongoose');

const dbconnect = () => {
       mongoose.connect('mongodb+srv://heettalaviya:Heet701652@cluster0.wrlse7q.mongodb.net/API')
        .then(() => {
            console.log("database conected successfully");
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = dbconnect;