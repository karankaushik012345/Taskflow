const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort = "-createdAt" } = req.query;
    const filter = { user: req.user._id };
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (search)   filter.title    = { $regex: search, $options: "i" };
    const tasks = await Task.find(filter).sort(sort);
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const result = { todo: 0, "in-progress": 0, done: 0 };
    stats.forEach(({ _id, count }) => { result[_id] = count; });
    result.total = result.todo + result["in-progress"] + result.done;
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask, getStats };