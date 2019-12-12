const User = require("../Models/User");
module.exports = {
  async list(req, res) {
    try {
      const users = await User.find({});
      if (!users) {
        return res.status(200).json({ message: " no users found" });
      }
      return res.status(200).json({ message: "retrieved users", users });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "An error occurred", e: err.toString() });
    }
  },

  async disableUser(req, res) {
    try {
      if (req.user.type !== "admin") {
        return res
          .status(401)
          .json({ message: "You cannot perform this operation" });
      }
      const { id } = req.params;
      const user = await User.findOne({ id });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (user.isDeleted) {
        return res.status(400).json({ message: "User is already inactive" });
      }
      user.isDeleted = true;
      await user.save();

      return res.status(200).json({ message: "User disabled successfully" });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "An error occurred", e: err.toString() });
    }
  },

  async enableUser(req, res) {
    try {
      if (req.user.type !== "admin") {
        return res
          .status(401)
          .json({ message: "You cannot perform this operation" });
      }
      const { id } = req.params;
      const user = await User.findOne({ id });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (user.isDeleted) {
        return res.status(400).json({ message: "User is already active" });
      }
      user.isDeleted = false;
      await user.save();

      return res.status(200).json({ message: "User enabled successfully" });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "An error occurred", e: err.toString() });
    }
  },

  async addUser(req, res) {
    try {
      if (req.user.type !== "admin") {
        return res
          .status(401)
          .json({ message: "You cannot perform this operation" });
      }
      const { email, password, username } = req.body;

      if (_.isEmpty(email) || _.isEmpty(password) || _.isEmpty(username)) {
        throw new Error("incomplete parameters");
      }

      const checkUserEmail = await User.findOne({ email });

      if (checkUserEmail) {
        return res.status(400).json({ message: "email already exists" });
      }

      const user = await User.create(req.body);
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
      return res.status(400).json({ message: "An error occured", error });
    }
  }
};
