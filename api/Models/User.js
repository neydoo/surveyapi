const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  password: { type: String, required: true, select: false },
  email: { type: String, required: true },
  username: { type: String, required: true },
  type: { type: String, default: "user", enum: ["user", "admin"] },
  surveys: { type: Schema.Types.ObjectId, ref: "Survey" }
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre("save", function (next){
  let user = this;
  console.log(user);
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
  next();
});

module.exports = mongoose.model("User", UserSchema);
