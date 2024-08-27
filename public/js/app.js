document.addEventListener("DOMContentLoaded", () => {
  const openCameraButton = document.getElementById("openCamera");
  const closeCameraButton = document.getElementById("closeCamera");
  const videoContainer = document.querySelector(".video-container");
  const video = document.getElementById("video");
  const captureButton = document.getElementById("capture");
  const canvas = document.getElementById("canvas");
  const fotoInput = document.getElementById("foto");
  const message = document.getElementById("message");
  const themeToggleButton = document.getElementById("toggleTheme");
  const table = document.getElementById("riwayatAbsensiTable");
  const tbody = table.querySelector("tbody");
  let stream = null;

  // Cek preferensi tema dari localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeButton(savedTheme);
  }

  themeToggleButton.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");

    // Toggle tema
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);

    // Simpan preferensi tema ke localStorage
    localStorage.setItem("theme", newTheme);

    // Update ikon dan teks tombol
    updateThemeButton(newTheme);
  });

  function updateThemeButton(theme) {
    if (theme === "dark") {
      themeToggleButton.innerHTML = '<i class="bi bi-moon-fill"></i> Dark Mode';
    } else {
      themeToggleButton.innerHTML =
        '<i class="bi bi-brightness-high-fill"></i> Light Mode';
    }
  }
  // Fungsi untuk membuka kamera saat tombol "Open Camera" ditekan
  openCameraButton.addEventListener("click", () => {
    videoContainer.style.display = "block";
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
        message.textContent = "Tidak dapat mengakses kamera.";
      });

    openCameraButton.style.display = "none";
  });

  // Fungsi untuk menangkap gambar dari video dan menampilkannya di canvas
  captureButton.addEventListener("click", () => {
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Ambil gambar dari canvas dan konversi ke data URL (base64)
    const dataURL = canvas.toDataURL("image/png");
    fotoInput.value = dataURL;

    // Tampilkan gambar yang diambil di SweetAlert
    Swal.fire({
      title: "Gambar Diambil!",
      text: "Gambar berhasil diambil dari kamera.",
      imageUrl: dataURL,
      imageWidth: 400,
      imageHeight: 300,
      imageAlt: "Gambar Wajah",
      confirmButtonText: "Oke",
    });

    message.textContent = "Gambar diambil!";
  });
  // Fungsi untuk menutup kamera saat tombol "Tutup Camera" ditekan
  closeCameraButton.addEventListener("click", () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      videoContainer.style.display = "none";
      openCameraButton.style.display = "block"; // Tampilkan kembali tombol "Open Camera"
    }
  });
  // Fungsi untuk mengirim data absensi ke server
  document
    .getElementById("absensiForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const nama = document.getElementById("nama").value;
      const tanggal = document.getElementById("tanggal").value;
      const foto = document.getElementById("foto").value;
      const status = document.getElementById("status").value;
      const sekarang = new Date();
      const waktu = `${sekarang.getHours()}:${sekarang.getMinutes()}`;
      let location = "";

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            location = `${position.coords.latitude},${position.coords.longitude}`;
            submitAbsensi(nama, tanggal, foto, waktu, status, location);
          },
          (error) => {
            console.error("Error getting location: ", error);
            submitAbsensi(nama, tanggal, foto, waktu, status, location);
          }
        );
      } else {
        submitAbsensi(nama, tanggal, foto, waktu, status, location);
      }
    });

  async function submitAbsensi(nama, tanggal, foto, waktu, status, location) {
    try {
      const response = await fetch("/absen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, tanggal, foto, waktu, status, location }),
      });

      const result = await response.json();

      // SweetAlert setelah berhasil absen
      Swal.fire({
        title: "Absensi Berhasil!",
        text: result.message,
        icon: "success",
        confirmButtonText: "Oke",
      });

      // Reset form
      document.getElementById("absensiForm").reset();
      document.getElementById("foto").value = "";

      // Matikan kamera setelah submit
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
        videoContainer.style.display = "none";
        openCameraButton.style.display = "block";
      }

      // Setelah absensi berhasil, ambil data absensi terakhir dan riwayat
      tampilkanAbsensiTerakhir();
      tampilkanRiwayatAbsensi();
    } catch (error) {
      console.error("Error submitting absensi:", error);

      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menyimpan absensi.",
        icon: "error",
        confirmButtonText: "Oke",
      });
    }
  }

  // Fungsi untuk menampilkan absensi terakhir
  async function tampilkanAbsensiTerakhir() {
    const response = await fetch("/absen/terakhir");
    const data = await response.json();
    document.getElementById("hasilNama").textContent = data.nama;
    document.getElementById("hasilTanggal").textContent = `${formatTanggal(
      data.tanggal
    )} ${data.waktu}`;
    document.getElementById("hasilGambar").src = data.foto;
    document.getElementById("hasilStatus").textContent = data.status;
    document.getElementById("hasilLocation").textContent = data.location;
  }

  // Fungsi untuk menampilkan riwayat absensi
  async function tampilkanRiwayatAbsensi() {
    const response = await fetch("/absen/riwayat");
    const riwayat = await response.json();

    const tbody = document.querySelector("#riwayatAbsensiTable tbody");
    tbody.innerHTML = "";

    riwayat.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${item.nama}</td>
      <td>${formatTanggal(item.tanggal)}</td>
      <td>${item.waktu}</td>
      <td>${item.status}</td>
      <td>
        <iframe
          src="https://maps.google.com/maps?q=${item.location}&amp;output=embed"
          width="100"
          height="100"
          frameborder="0"
          style="border:0;"
          allowfullscreen=""
        ></iframe>
      </td>
      <td><img src="${item.foto}" width="100"></td>
    `;
      tbody.appendChild(row);
    });
  }

  function formatTanggal(tanggal) {
    if (!tanggal) return "";
    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  tampilkanAbsensiTerakhir();
  tampilkanRiwayatAbsensi();
});
main.js;
// import "./theme.js";
// import "./camera.js";
// import "./absensi.js";
// import "./display.js";

// document.addEventListener("DOMContentLoaded", () => {
//   // Ini adalah tempat untuk inisialisasi jika diperlukan.
// });
