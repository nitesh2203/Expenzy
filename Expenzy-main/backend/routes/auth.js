const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Signup API
router.post("/signup", async (req, res) => {
  try {
    const { email, password, income } = req.body; // Include income
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ email, password, income: income || 0 }); // Ensure income is set
    await user.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ msg: "Login successful", user });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
