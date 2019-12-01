const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SurveySchema = new Schema({
  fullName: { type: String, required: true },
  lat: { type: String },
  lng: { type: String },
  play: { type: String, required: true },
  collectedBy: { type: Schema.Types.ObjectId, ref: "User" },
  answer1: { type: String, required: true },
  answer2: { type: String, required: true },
  answer3: { type: String, required: true },
  answer4: { type: String, required: true },
  answer5: { type: String, required: true }
});


module.exports = mongoose.model("Survey", SurveySchema);
