const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlacklistModel = require("../models/blacklist.model");

// register controller
const userRegisterContoller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const isExistingUser = await userModel.findOne({ email });

    if (isExistingUser) {
      return res.status(409).json({
        message: "User already exists!",
        success: false,
      });
    }

    const user = await userModel.create({
      email,
      password, // hashed via pre-save
      name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    const userData = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    res.status(201).json({
      message: "User registered successfully",
      data: userData,
      success: true,
    });

    await emailService.sendRegistrationEmail(user.email, user.name);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// login controller
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required!",
        success: false,
      });
    }

    // find user + include password
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User login successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// logout controller
const userLogoutController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(200).json({
        message: "User logged Out Successfully",
        success: true,
      });
    }

    await tokenBlacklistModel.create({
      token: token,
    });

    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  userRegisterContoller,
  userLoginController,
  userLogoutController,
};
