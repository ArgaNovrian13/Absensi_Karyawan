const db = require("../config/db");

const Absensi = {
  // Cek apakah absensi sudah dilakukan hari ini

  checkAbsensi: (nama, tanggal, callback) => {
    const sql = "SELECT * FROM absensi WHERE nama = ? AND tanggal = ?";
    db.query(sql, [nama, tanggal], callback);
  },

  // Simpan data absensi baru
  insertAbsensi: (data, callback) => {
    const sql =
      "INSERT INTO absensi (nama,tanggal,waktu,foto,status,ip_address,location) VALUES (?,?,?,?,?,?,?)";
    db.query(
      sql,
      [
        data.nama,
        data.tanggal,
        data.waktu,
        data.foto,
        data.status,
        data.ip_address,
        data.location,
      ],
      callback
    );
  },

  // Dapatkan data absensi terakhir
  getLastAbsensi: (callback) => {
    const sql = "SELECT * FROM absensi ORDER BY id DESC LIMIT 1";
    db.query(sql, callback);
  },

  // Dapatkan riwayat absensi
  getRiwayatAbsensi: (callback) => {
    const sql = "SELECT * FROM absensi ORDER BY tanggal DESC";
    db.query(sql, callback);
  },
};

module.exports = Absensi;
