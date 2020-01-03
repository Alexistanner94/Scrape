const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },

  url: {
    type: String,
    required: true
  }
});
