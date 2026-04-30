const express = require("express");
const { isAuthMidleWare } = require("../middlewares/auth.middleare");

const transactionRouter = express.Router();

transactionRouter.post("/", isAuthMidleWare);

module.exports = transactionRouter;
