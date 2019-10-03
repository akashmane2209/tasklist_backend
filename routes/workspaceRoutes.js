const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport/passportConfig");
const userChecker = require("../middleware/userChecker");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

router
  .route("/")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    workspaceController.getAllWorkspaces
  )
  .post(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userChecker.checkUser,
    workspaceController.addWorkspace
  );
router
  .route("/:id")
  .get(
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    workspaceController.getWorkspaceById
  );

module.exports = router;
