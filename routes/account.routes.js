const express = require("express");
const { isAuthMidleWare } = require("../middlewares/auth.middleare");
const {
  createAccountController,
} = require("../controllers/account.controller");

const accountRouter = express.Router();

accountRouter.post("/", isAuthMidleWare, createAccountController);

module.exports = accountRouter;
