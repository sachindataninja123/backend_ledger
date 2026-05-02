const express = require("express");
const { isAuthMidleWare } = require("../middlewares/auth.middleare");
const {
  createAccountController,
  getUserAccountController,
  getAccountBalanceController,
} = require("../controllers/account.controller");

const accountRouter = express.Router();

// post create account
accountRouter.post("/", isAuthMidleWare, createAccountController);

//get all accounts
accountRouter.get("/all-accounts", isAuthMidleWare, getUserAccountController);

//get Balance
accountRouter.get("/balance/:accountId", isAuthMidleWare, getAccountBalanceController);

module.exports = accountRouter;
