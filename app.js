const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const absensiRoutes = require("./routes/absensiRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = crypto.randomBytes(64).toString("hex");

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
// Gunakan route yang sudah didefinisikan
app.use(absensiRoutes);
app.use(userRoutes);
app.use(profileRoutes);

// Jalankan server di port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
