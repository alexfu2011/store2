const express = require("express");
const router = require("./routes");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/store", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("open", function () {
    console.log("Connected to MongoDB...");
});

const PORT = "5050";

const app = express();
app.use(cookieParser());
app.use("/", router);
app.use("/", (req, res) => res.status(404).json("No API route found"));

app.listen(PORT);
console.log(`API Server running at http://localhost:${PORT}`);