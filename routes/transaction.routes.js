const express = require("express");
const { isAuthMidleWare } = require("../middlewares/auth.middleare");
const { createTransaction } = require("../controllers/transaction.controller");

const transactionRouter = express.Router();

//create transactions POST
transactionRouter.post("/", isAuthMidleWare, createTransaction);

// create system/initial-funds

module.exports = transactionRouter;
