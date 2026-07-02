const express = require("express");
const { updateProfile, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const router = express.Router();
router.use(protect);
router.put("/profile",  updateProfile);
router.put("/password", changePassword);
module.exports = router;