const express = require("express");
const {
  isAuthMidleWare,
  isSystemUserMiddleWare,
} = require("../middlewares/auth.middleare");
const {
  createTransaction,
  createInitialFundsTransaction,
} = require("../controllers/transaction.controller");

const transactionRouter = express.Router();

//create transactions POST
transactionRouter.post("/", isAuthMidleWare, createTransaction);

// create system/initial-funds
transactionRouter.post(
  "/system/initial-funds",
  isSystemUserMiddleWare,
  createInitialFundsTransaction,
);

module.exports = transactionRouter;
