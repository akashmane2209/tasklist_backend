const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const userChecker = require("../middleware/userChecker");
const router = express.Router();
const teamController = require("../controllers/teamController");
router
  .route("/")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    teamController.getAllTeams
  )
  .post(
    // passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    teamController.addTeam
  );

router
  .route("/:id")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    teamController.getTeamById
  )
  .put(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    teamController.updateTeam
  );
module.exports = router;
