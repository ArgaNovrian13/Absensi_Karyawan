document.addEventListener("DOMContentLoaded", () => {
  const toggleThemeBtn = document.getElementById("toggleTheme");

  // Cek tema yang disimpan di localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    updateThemeButtonText(savedTheme);
  }

  // Event listener untuk tombol ganti tema
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    // Simpan preferensi tema ke localStorage
    const currentTheme = document.body.classList.contains("light-mode")
      ? "light-mode"
      : "dark-mode";
    localStorage.setItem("theme", currentTheme);

    updateThemeButtonText(currentTheme);
  });

  // Fungsi untuk memperbarui teks tombol tema
  function updateThemeButtonText(theme) {
    const icon = toggleThemeBtn.querySelector("i");
    if (theme === "light-mode") {
      toggleThemeBtn.innerHTML = `<i class="bi bi-moon-fill"></i> Dark Mode`;
    } else {
      toggleThemeBtn.innerHTML = `<i class="bi bi-brightness-high-fill"></i> Light Mode`;
    }
  }
});
