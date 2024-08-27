const db = require("../config/db");
const bcrypt = require("bcrypt");

// Fungsi untuk mendaftarkan pengguna baru
const registerUser = (username, email, password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (error, results) => {
        if (error) return callback(error);
        callback(null, results);
      }
    );
  });
};

// Fungsi untuk login pengguna
const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) return callback(error);
    callback(null, results);
  });
};

module.exports = {
  registerUser,
  findUserByEmail,
};
