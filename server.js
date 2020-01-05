const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/MongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/articles", function(req, res) {
  // db.Article.find();

  res.json({
    message: "Hello"
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
