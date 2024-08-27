const moment = require("moment");
const Absensi = require("../models/absensiModel");

const showAbsensiPage = (req, res) => {
  res.render("absensi");
};

const submitAbsensi = (req, res) => {
  const { nama, tanggal, foto, waktu, status, location } = req.body;
  const formattedDate = moment(tanggal).format("YYYY-MM-DD");

  // Dapatkan alamat IP dari request
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Cek apakah absensi sudah dilakukan untuk hari ini
  Absensi.checkAbsensi(nama, formattedDate, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      return res
        .status(400)
        .send({ message: "Anda sudah melakukan absensi hari ini!" });
    }

    // Simpan data absensi jika belum ada
    const data = {
      nama,
      tanggal: formattedDate,
      waktu,
      foto,
      status,
      ip_address: ipAddress,
      location,
    };

    Absensi.insertAbsensi(data, (err) => {
      if (err) throw err;
      res.send({ message: "Absensi berhasil disimpan!" });
    });
  });
};

const getLastAbsensi = (req, res) => {
  Absensi.getLastAbsensi((err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
};

const getRiwayatAbsensi = (req, res) => {
  Absensi.getRiwayatAbsensi((err, results) => {
    if (err) throw err;
    res.send(results);
  });
};

module.exports = {
  showAbsensiPage,
  submitAbsensi,
  getLastAbsensi,
  getRiwayatAbsensi,
};
