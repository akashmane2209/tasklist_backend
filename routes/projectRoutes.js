const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const userChecker = require("../middleware/userChecker");

const router = express.Router();

const projectController = require("../controllers/projectController");

router
  .route("/")
  .post(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    projectController.addProject
  )
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    // userChecker.checkUser,
    projectController.getAllProjects
  );

router
  .route("/:id")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    projectController.getProjectsByWorkspaceId("workspace")
  )
  .put(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    projectController.updateProjectById
  );

router
  .route("/team/:teamId")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    projectController.getProjectsByTeamId
  );

module.exports = router;
