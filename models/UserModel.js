const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String,
    password : String,
    date_naissance : Date,
    sexe : String
});

const User = mongoose.model("User" , UserSchema);

module.exports = User;