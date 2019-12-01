const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoDB = "mongodb://nedu:password1@ds029476.mlab.com:29476/survey";
const passport = require("passport");
require("./passport");

mongoose.connect(mongoDB, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./api/routes/index");
const usersRouter = require("./api/routes/users");
const authRouter = require("./api/routes/auth");
const surveyRouter = require("./api/routes/survey");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/survey",passport.authenticate("jwt", { session: false }), surveyRouter);

module.exports = app;
