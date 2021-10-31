
require("./config/db")

const express = require("express");
const app = express();
const bodyParser = require("express").json;

const UserRouter = require("./api/User");

app.use(bodyParser());
app.use(express.urlencoded({ extended : true}));

app.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.json({ message: "API login avec express" });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});