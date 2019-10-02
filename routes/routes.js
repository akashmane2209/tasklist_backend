const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const router = express.Router();

// controllers
const loginController = require("../controllers/loginController");

// admin login contoller
router
  .route("/login")
  .post(
    passport.authenticate(passportConfig.METHOD_LOCAL, { session: false }),
    loginController.loginUser
  );

module.exports = router;
