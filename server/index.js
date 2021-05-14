const express = require("express");
const path = require("path");
const router = require("./routes");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/store2", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on("open", function () {
    console.log("Connected to MongoDB...");
});

const PORT = "5050";

const app = express();
app.use(express.static(path.join(__dirname, "images")));
app.use(cookieParser());
app.use("/", router);
app.use("/", (req, res) => res.status(404).json("No API route found"));

app.listen(PORT);
console.log(`API Server running at http://localhost:${PORT}`);