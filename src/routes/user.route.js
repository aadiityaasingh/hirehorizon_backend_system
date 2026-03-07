const express = require("express");
const {
  login,
  logout,
  register,
  updateProfile,
} = require("../controllers/user.controller.js");

const isAuthenticated = require("../middlewares/isAuthenticated.js");
const { singleUpload } = require("../middlewares/multer.js");

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);

router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);

module.exports = router;