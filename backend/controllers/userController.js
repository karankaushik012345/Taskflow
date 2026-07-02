const User = require("../models/User");

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: "Current password incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated" });
  } catch (err) { next(err); }
};

module.exports = { updateProfile, changePassword };