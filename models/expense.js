const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    price: { type: Number, required: true },
    description: String,
    categary: String,
    userId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
