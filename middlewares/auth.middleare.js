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

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.userId;

    //     const user = await userModel.findById(decoded.userId);
    // req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
    isAuthMidleWare
}
