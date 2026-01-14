import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,        
    sameSite: "none",    
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  expires: new Date(0),
});

  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email _id');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
