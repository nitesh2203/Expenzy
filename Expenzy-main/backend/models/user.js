const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  income: { type: Number, default: 0 },
  
  // Stores individual daily expenses
  dailyLog: [
    {
      amount: Number,
      category: String,
      date: { type: Date, default: Date.now }
    }
  ],

  // Stores summarized weekly expenses
  weeklySummary: [
    {
      weekStart: Date, // Start of the week
      totalSpent: Number,
      categories: [{ category: String, totalAmount: Number }]
    }
  ],

  // Stores summarized monthly expenses
  monthlySummary: [
    {
      monthStart: Date, // Start of the month
      totalSpent: Number,
      categories: [{ category: String, totalAmount: Number }]
    }
  ],
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
