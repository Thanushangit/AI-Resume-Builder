import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    newUser.password = undefined;

    res
      .status(201)
      .json({
        success: true,
        message: "User Created successfully",
        token,
        user: newUser,
      });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};

// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.comparePassword(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token,
        user
      });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};


// GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.userId;

    const user =await User.findById(userId);

    if(!user){
       return res.status(404).json({ success: false, message: "User not found." });
    }

    user.password=undefined;

    res
      .status(200)
      .json({
        success: true,
        user
      });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};

// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const { userId } = req.userId;

    const resumes =await Resume.find(userId);
    res
      .status(200)
      .json({
        success: true,
        resumes
      });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};