const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// Render halaman registrasi
const showRegisterPage = (req, res) => {
  res.render("register");
};

// Render halaman login
const showLoginPage = (req, res) => {
  res.render("login");
};

// Registrasi pengguna baru
const register = (req, res) => {
  const { username, email, password } = req.body;

  userModel.registerUser(username, email, password, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.redirect("/login"); // Redirect ke halaman login setelah registrasi
  });
};

// Login pengguna
const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    // Periksa password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Simpan data pengguna ke dalam sesi
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.redirect("/absensi"); // Redirect ke halaman profil setelah login
  });
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
module.exports = {
  showRegisterPage,
  showLoginPage,
  register,
  login,
  logout,
};
