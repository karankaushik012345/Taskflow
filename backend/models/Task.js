const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: [true, "Title required"], trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500, default: "" },
  status:      { type: String, enum: ["todo","in-progress","done"], default: "todo" },
  priority:    { type: String, enum: ["low","medium","high"], default: "medium" },
  dueDate:     { type: Date, default: null },
  tags:        [{ type: String, trim: true }],
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model("Task", taskSchema);