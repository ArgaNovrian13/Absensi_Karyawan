const db = require("../config/db");

const profileModel = {
  getUserProfile: (userId, callback) => {
    const sql = "SELECT username, email FROM users WHERE id = ?";
    db.query(sql, [userId], callback);
  },
};

module.exports = profileModel;
