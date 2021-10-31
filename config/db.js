require('dotenv').config();
const mongoose = require("mongoose");

mongoose
    .connect(process.env.mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=> {
        console.log("Connexion établie avec mongo DB")
    })
    .catch((err)=> console.log(err));