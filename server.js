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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
  axios.get("https://www.ajc.com/life/buzz-blog/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h3.tease__heading").each(function(i, element) {
      let result = {};

      result.headline = $(element)
        .children("a")
        .text();

      result.summary = $(element)
        .children("a")
        .text();

      result.link = $(element)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Complete");
  });
});

app.get("/api/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/api/articles/saved", function(req, res) {
  db.Article.find({ saved: true })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/api/articles/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
    .populate("notes")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/api/articles/:id", function(req, res) {
  console.log(req.params.id);
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    });
});

app.post("/api/articles/save/:id", function(req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { saved: req.body.saved } },
    { new: true }
  )
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// app.get("/articles", function(req, res) {
//   // db.Article.find();

//   res.json({
//     message: "Hello"
//   });
// });
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
