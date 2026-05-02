const accountModel = require("../models/account.model");

const createAccountController = async (req, res) => {
  try {
    const user = req.user;

    const account = await accountModel.create({
      user: user._id,
    });

    return res.status(201).json({
      message: "Acccount created successfully",
      account: account,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getUserAccountController = async (req, res) => {
  try {
    const accounts = await accountModel.find({ user: req.user._id });

    if (!accounts) {
      return res.status(400).json({
        message: "Accounts not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Accounts fetched successfully",
      accounts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getAccountBalanceController = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
      _id: accountId,
      user: req.user._id,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account Not Found!",
      });
    }

    const balance = await account.getBalance();

    return res.status(200).json({
      accountId: account._id,
      balance: balance,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  createAccountController,
  getUserAccountController,
  getAccountBalanceController,
};
