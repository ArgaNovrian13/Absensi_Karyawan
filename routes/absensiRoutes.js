const express = require("express");
const router = express.Router();
const absensiController = require("../controllers/absensiController");
const authMiddleware = require("../middleware/authMiddleware");

// Route untuk menyimpan absensi
router.post("/absen", absensiController.submitAbsensi);

// Route untuk menampilkan halaman absensi
router.get("/absensi", authMiddleware, (req, res) => {
  res.render("absensi", { username: req.session.user.username });
});

// Route untuk mendapatkan data absensi terakhir
router.get("/absen/terakhir", absensiController.getLastAbsensi);

// Route untuk mendapatkan riwayat absensi
router.get("/absen/riwayat", absensiController.getRiwayatAbsensi);

module.exports = router;
