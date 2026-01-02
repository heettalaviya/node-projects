const mongoose = require("mongoose");

const dbconnect = () => {
  mongoose.connect('mongodb+srv://heettalaviya:Heet701652@cluster0.wrlse7q.mongodb.net/movie')
    .then(() => {
      console.log('database is connected');
    })
    .catch((err) => {
      console.log(err);
    })
}
module.exports = dbconnect;