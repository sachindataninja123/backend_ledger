const express = require("express");
const { userRegisterContoller, userLoginController } = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", userRegisterContoller);
authRouter.post("/login" , userLoginController)

module.exports = authRouter;
