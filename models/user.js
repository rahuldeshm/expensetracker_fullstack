const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  phone: Number,
  password: { type: String, required: true },
  ispremium: Boolean,
  total: Number,
  verified: Boolean,
  expenses: [],
});

module.exports = mongoose.model("User", userSchema);
