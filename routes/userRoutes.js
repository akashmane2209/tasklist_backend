const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const userChecker = require("../middleware/userChecker");

const router = express.Router();

const userController = require("../controllers/userController");

router
  .route("/")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    userController.getAllUsers
  );

router
  .route("/:id")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userController.getUserById
  );

router.route("/signup").post(userController.addUser);

router
  .route("/login")
  .post(
    passport.authenticate(passportConfig.METHOD_LOCAL, { session: false }),
    userController.loginUser
  );

router
  .route("/team/:teamId")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userController.getUserByTeamId
  );

module.exports = router;
