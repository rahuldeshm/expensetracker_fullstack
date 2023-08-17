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
  expenses: [
    {
      expenseId: {
        type: Schema.Types.ObjectId,
        ref: "Expense",
        required: true,
      },
    },
  ],
});
userSchema.methods.updateTotalNew = function (total) {
  this.total = total.total;
  this.expenses = [...this.expenses, { expenseId: total.expenseId }];
  return this.save();
};
userSchema.methods.updateTotalDelete = function (total) {
  this.total = total.total;
  this.expenses = [...this.expenses].filter(
    (e) => e.expenseId.toString() !== total.expenseId.toString()
  );
  return this.save();
};
userSchema.methods.updateTotalEdit = function (total) {
  this.total = total.total;
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
