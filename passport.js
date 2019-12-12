const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTstrategy = require("passport-jwt").Strategy;
const jwtSecret = process.env.jwtSecret || "secret";

const User = require("./api/Models/User");

const authenticate = async (email, password, done) => {
  try {
    let user = {};
    user = await User.findOne({ $or: [{ email }, { username: email }] }).select(
      "+password"
    );

    if (!user) {
      return done(null, false, {
        message: "Incorrect email/username."
      });
    } else if (!user.validPassword(password)) {
      return done(null, false, {
        message: "Incorrect password."
      });
    }
    user = await User.findOne({
      $or: [{ email }, { username: email }],
      isDeleted: false
    });
    return done(null, user);
  } catch (e) {
    console.error("error", e);
  }
};

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  (email, password, done) => {
    authenticate(email, password, done);
  }
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret"
};

passport.use(
  "jwt",
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      User.findOne({
        id: jwt_payload._id
      }).then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  })
);

passport.use("local", localStrategy);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;
