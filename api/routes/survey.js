const express = require("express");
const router = express.Router();
const survey = require("../Controllers/surveyController");

router.post("/create", survey.save);

router.get("/test", (req, res) => {
  res.send("nicely");
});
module.exports = router;
