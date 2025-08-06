const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Add Daily Expense
router.post("/daily", async (req, res) => {
  try {
    const { email, amount, category } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.dailyLog.push({ amount, category });
    await user.save();
    res.json({ msg: "Daily expense added", dailyLog: user.dailyLog });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get Daily Log
router.get("/daily/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.dailyLog);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
