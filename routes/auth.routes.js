const express = require("express");
const { userRegisterContoller, userLoginController, userLogoutController } = require("../controllers/auth.controller");

const authRouter = express.Router();

// register
authRouter.post("/register", userRegisterContoller);

//login
authRouter.post("/login" , userLoginController)

//logout
authRouter.post("/logout" , userLogoutController)

module.exports = authRouter;
