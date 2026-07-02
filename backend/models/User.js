const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Name required"], trim: true, maxlength: 50 },
  email:    { type: String, required: [true, "Email required"], unique: true, lowercase: true },
  password: { type: String, required: [true, "Password required"], minlength: 6, select: false },
  avatar:   { type: String, default: "" },
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);