const tokenBlacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const isAuthMidleWare = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access, token is missing",
      });
    }

    const isBlackListed = await tokenBlacklistModel.findOne({
      token,
    });

    if (isBlackListed) {
      return res.status(401).json({
        message: "Unauthorized access , token is invalid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // req.userId = decoded.userId;

    const user = await userModel.findById(decoded.userId);
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const isSystemUserMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      req.cookies.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access, token is missing",
      });
    }


    const isBlackListed = await tokenBlacklistModel.findOne({
      token,
    });
    
    if (isBlackListed) {
      return res.status(401).json({
        message: "Unauthorized access , token is invalid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Forbidden access, not a system user",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  isAuthMidleWare,
  isSystemUserMiddleWare,
};
