/**
 * AuthController
 *
 * :: Server-side logic for managing survey data
 */

const Survey = require("../Models/Survey");
const _ = require("lodash");

module.exports = {
  async save(req, res) {
    try {
      const {
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        } = req.body;

      if (
        _.isEmpty(answer1) ||
        _.isEmpty(answer2) ||
        _.isEmpty(answer3) ||
        _.isEmpty(answer4) ||
        _.isEmpty(answer5)
      ) {
        throw new Error("incomplete parameters");
      }

      let surveyData = req.body;
      surveyData.collectedBy = req.user._id;

      console.log(req.body)
      const data = await Survey.create(surveyData);

      return res.status(200).json({
        message: "survey successful",
        success: true,
        data
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "an error occured", error });
    }
  },

};
