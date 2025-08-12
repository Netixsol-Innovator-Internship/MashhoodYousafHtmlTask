const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");

const JWT_KEY = "chooseAnyStrongKey";
const SALT_ROUNDS = 12;

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
    if (!users || users.length === 0) {
      const error = new Error("No users found. Create a user first.");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    console.error("getUsers error:", err);
    const error = new Error("Fetching users failed, please try again later.");
    error.status = 500;
    return next(error);
  }
  return res.json({
    success: true,
    message: "totalUsers",
    users: users.map((u) => u.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid signup data.");
    error.status = 422;
    error.data = errors.array();
    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists with this email.");
      error.status = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      tasks: [],   //empty when user first register
    });

    await createdUser.save();

    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: createdUser.id, email: createdUser.email },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    const error = new Error("Signing up failed, please try again later.");
    error.status = 500;
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.status = 400;
    return next(error);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      return next(error);
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      user: { id: existingUser.id, email: existingUser.email },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    const error = new Error("Sign-in failed, please try again later.");
    error.status = 500;
    return next(error);
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
