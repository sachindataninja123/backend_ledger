const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const mongoose = require("mongoose");
const emailService = require("../services/email.service");

const createTransaction = async (req, res) => {
  try {
    //1. validate request
    const { fromAccount, toAccount, amount, idemPotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idemPotencyKey) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const fromUserAccount = await accountModel.findOne({
      _id: fromAccount,
    });

    const toUserAccount = await accountModel.findOne({
      _id: toAccount,
    });

    if (!fromUserAccount || !toUserAccount) {
      return res.status(400).json({
        message: "Invalid fromAccount or toAccount",
      });
    }

    //2. validate idempotencyKey
    const isTransactionAlreadyExists = await transactionModel.findOne({
      idemPotencyKey: idemPotencyKey,
    });

    if (!isTransactionAlreadyExists) {
      if (isTransactionAlreadyExists.status === "COMPLETED") {
        return res.status(200).json({
          message: "Transaction already processed",
          transaction: isTransactionAlreadyExists,
        });
      }
      if (isTransactionAlreadyExists.status === "PENDING") {
        return res.status(200).json({
          message: "Transaction is still processing",
        });
      }
      if (isTransactionAlreadyExists.status === "FAILED") {
        return res.status(500).json({
          message: "Transaction processing failed, please retry",
        });
      }
      if (isTransactionAlreadyExists.status === "REVERSED") {
        return res.status(500).json({
          message: "Transaction was reversed, please retry",
        });
      }
    }

    //3. check account status
    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      return res.status(400).json({
        message: "Both accounts must be active to perform a transaction",
      });
    }

    //4 .Derive sender balance from ledger
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      return res.status(400).json({
        message: `insufficient balance. Current balance is ${balance}. Requested amount is ${amount} `,
      });
    }

    //5. create transaction (PENDING)
    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModel.create(
      {
        fromAccount,
        toAccount,
        amount,
        idemPotencyKey,
        status: "PENDING",
      },
      { session },
    );

    // create debit ledger entry
    const debitLedgerEntry = await ledgerModel.create(
      {
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
      { session },
    );

    // create credit ledger entry
    const creditLedgerEntrt = await ledgerModel.create(
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
      { session },
    );

    // mark transaction completed
    ((transaction.status = "COMPLETED"), await transaction.save({ session }));

    // commit mongoDB session
    await session.commitTransaction();
    session.endSession();

    // send email notification
    await emailService.sendTransactionEmail(
      req.user.email,
      req.user.name,
      amount,
      toAccount,
    );

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction: transaction,
    });


  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


module.exports = {createTransaction}