var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function(app) {
  // Scrape news and insert into MongoDB

  app.get("/scrape", function(req, res) {
    axios.get("https://www.ajc.com/life/buzz-blog/").then(function(response) {
      var $ = cheerio.load(response.data);
      $("h3.tease_heading").each(function(i, element) {
        let headline = $(element)
          .children("a")
          .text();

        let story = $(element)
          .find("p.p")
          .text();

        let link = $(element)
          .children("a")
          .attr("href");

        result = {
          headline: headline,
          story: story,
          link: link
        };

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
};
