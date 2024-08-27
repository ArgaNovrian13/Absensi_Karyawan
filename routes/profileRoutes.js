const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

// Rute profil, hanya bisa diakses jika pengguna sudah login
router.get("/profile", authMiddleware, profileController.getProfilePage);

module.exports = router;
