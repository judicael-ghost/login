
require("./config/db")

const express = require("express");
const app = express();
const bodyParser = require("express").json;
const path = require('path');
const UserRouter = require("./api/User");

app.use(bodyParser());
app.use(express.urlencoded({ extended : true}));

app.use("/user", UserRouter);

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});