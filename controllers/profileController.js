const profileModel = require("../models/profileModel");

const getProfilePage = (req, res) => {
  const userId = req.session.user.id; // Ambil ID pengguna dari sesi

  profileModel.getUserProfile(userId, (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }

    const userProfile = results[0];
    res.render("profile", { userProfile });
  });
};

module.exports = {
  getProfilePage,
};
