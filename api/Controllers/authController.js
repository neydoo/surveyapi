/**
 * AuthController
 *
 * :: Server-side logic for managing authentication
 */

const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const JwtService = require("../../auth.module");
const _ = require("lodash");

module.exports = {
  async register(req, res) {
    try {
      const { email, password, username, type } = req.body;

      let userData = { email, password, username, type };

      if (_.isEmpty(email) || _.isEmpty(password)) {
        throw new Error("incomplete parameters");
      }

      const checkUserEmail = await User.findOne({ email });

      if (checkUserEmail) {
        return res.status(400).json({ message: "email already exists" });
      }

      const user = await User.create(userData);
      const token = await JwtService.issueToken({
        id: user._id,
        email: user.email
      });

      const data = { user, token };

      return res.status(200).json({
        message: "user registered successfully",
        success: true,
        data
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "an error occured", error });
    }
  },

  async login(req, res) {
    try {
      passport.authenticate("local", async (err, user, info) => {
        if (!user) {
          let message = info ? info.message : "An error occured here";
          let data = info ? info.data : err;
          return res.status(401).json({ message, data });
        }

        const token = await JwtService.issueToken({
          id: user._id,
          email: user.email
        });

        const payload = { user };
        payload.token = token;

        return res.status(200).json({
          success: true,
          message: "login successful",
          payload
        });
      })(req, res);
    } catch (err) {
      return res.status(401).json({ message: "An error occured", err });
    }
  },

  // for when we get a mail service and are able to send an email
  async resetLink(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({
        email
      });

      if (!user) {
        return res.status(400).json({ message: "invailid user" });
      }

      const generateCode = (length, chars) => {
        if (!chars) {
          chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        }
        let result = "";
        for (let i = length; i > 0; --i) {
          result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
      };

      const verificationCode = await generateCode(11);

      const emailData = { email, verificationCode };
      await User.update({ verificationCode }, { where: { email } });

      await Email.sendResetEmail(emailData);

      return res.status(200).json({ message: "reset email sent" });
    } catch (error) {
      return res.status(401).json({ message: "An error occured", err });
    }
  },

  async verifyCode(req, res) {
    try {
      const verificationCode = req.params.id;

      const user = await User.findOne({ verificationCode });

      if (!user) {
        return res.status(400).json({ message: "invalid code" });
      }

      return res.status(200).json({
        success: true,
        message: "valid code",
        user
      });
    } catch (error) {
      return res.status(400).json({ message: "An error occured" });
    }
  },

  async resetPassword(req, res) {
    try {
      const data = req.body;
      const { id } = req.params;

      const user = await User.findOne({
        where: { verificationCode: id }
      });
      if (!user) {
        return false;
      }

      if (data.password) {
        if (data.password.trim() !== "") {
          const hash = bcrypt.hashSync(data.password, 8);
          data.password = hash;
        } else {
          return false;
        }
      }

      await User.update(data, {
        where: { id: user.id }
      });

      return res
        .status(200)
        .json({ message: "Password reset successfully", success: true, user });
    } catch (e) {
      return res
        .status(400)
        .json({ message: "An error occured", e: e.toString() });
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ message: "Invalid User Id" });
      }

      await User.findByIdAndUpdate(id,req.body);
      return res
        .status(200)
        .json({ message: "successfully updated user" });
    } catch (e) {
      return res
        .status(400)
        .json({ message: "An error occured", e: e.toString() });
    }
  }
};
