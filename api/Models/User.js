const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  password: { type: String, required: true, select: false },
  email: { type: String, required: true },
  surveys: { type: Schema.Types.ObjectId, ref: "Survey" }
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

this.toJSON = function() {
  var values = Object.assign({}, this.get());

  delete values.password;
  if (values.verificationCode) {
    delete values.verificationCode;
  }
  return values;
};

UserSchema.pre("save", user => {
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
  next();
});

module.exports = mongoose.model("User", UserSchema);
