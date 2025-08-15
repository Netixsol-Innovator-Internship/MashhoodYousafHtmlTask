const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");
const ErrorResponse = require("../utils/errorResponse");

const adminEmails = ["admin1@example.com", "admin2@example.com"];
const JWT_KEY = "chooseAnyStrongKey";
const SALT_ROUNDS = 12;

// /**
//  * @swagger
//  * /api/users:
//  *   get:
//  *     summary: Get all users (excluding passwords)
//  *     tags: [Users]
//  *     responses:
//  *       200:
//  *         description: List of all registered users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: totalUsers
//  *                 users:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       id:
//  *                         type: string
//  *                         example: 64e28d56c0a5ef001edabc12
//  *                       name:
//  *                         type: string
//  *                         example: John Doe
//  *                       email:
//  *                         type: string
//  *                         example: john@example.com
//  *       404:
//  *         description: No users found
//  *       500:
//  *         description: Server error
//  */

// const getUsers = async (req, res, next) => {
//   let users;
//   try {
//     users = await User.find({}, "-password");
//     if (!users || users.length === 0) {
//       const error = new Error("No users found. Create a user first.");
//       error.status = 404;
//       return next(error);
//     }
//   } catch (err) {
//     console.error("getUsers error:", err);
//     const error = new Error("Fetching users failed, please try again later.");
//     error.status = 500;
//     return next(error);
//   }
//   return res.json({
//     success: true,
//     message: "totalUsers",
//     users: users.map((u) => u.toObject({ getters: true })),
//   });
// };

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: myStrongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64e28d56c0a5ef001edabc12
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI...
 *       409:
 *         description: User already exists
 *       422:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ErrorResponse(
      "Invalid signup data.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new ErrorResponse(
        "User already exists with this email.",
        409,
        {},
        false
      );
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = adminEmails.includes(email) ? "admin" : "user";

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await createdUser.save();

    const token = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: createdUser._id,
        email: createdUser.email,
        role: createdUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("signup error:", err);
    const error = new ErrorResponse(
      "Signing up failed, please try again later.",
      500,
      {},
      false
    );
    return next(error);
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: myStrongPassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64e28d56c0a5ef001edabc12
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI...
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new ErrorResponse(
      "Invalid Credentials.",
      422,
      errors.array(),
      false
    );
    
    return next(error);
  }
  
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!existingUser || !isValidPassword) {
      const error = new ErrorResponse(
        "Invalid Credentials.",
        422,
        errors.array(),
        false
      );

      return next(error);
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      JWT_KEY,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message:'User LoggedIn Succesfully',  
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    const error = new ErrorResponse(
      "Invalid Credentials.",
      422,
      errors.array(),
      false
    );

    return next(error);
  }
};

// exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
