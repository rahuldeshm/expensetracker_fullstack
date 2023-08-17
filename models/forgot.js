const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const forgotSchema = new Schema({
  id: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  isactive: Boolean,
});

module.exports = mongoose.model("Forgot", forgotSchema);
