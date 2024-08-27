const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Menampilkan halaman registrasi
router.get("/register", userController.showRegisterPage);

// Menampilkan halaman login
router.get("/login", userController.showLoginPage);

// Registrasi pengguna baru
router.post("/register", userController.register);

// Login pengguna
router.post("/login", userController.login);

router.get("/logout", userController.logout);
module.exports = router;
