// Ganti dengan email yang diterima dari backend setelah proses login
// let email = "";

// Get query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
const role = urlParams.get("role");

// Send data to the backend
fetch("https://kosconnect-server.vercel.app/auth/googleauth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, role }),
})
  .then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "Periksa kredensial Anda.");
      });
    }
    return response.json();
  })
  .then((result) => {
    if (result.token && result.role) {
      // Simpan token dan role ke cookie
      document.cookie = `authToken=${result.token}; path=/; secure;`;
      document.cookie = `userRole=${result.role}; path=/; secure;`;

      // Alihkan pengguna berdasarkan role
      if (result.role === "user") {
        window.location.href = "https://kosconnect.github.io/";
      } else if (result.role === "owner") {
        window.location.href = "https://kosconnect.github.io/dashboard-owner";
      } else if (result.role === "admin") {
        window.location.href = "https://kosconnect.github.io/dashboard-admin";
      }
    } else {
      // Handle error (e.g., invalid data or server error)
      console.error("Error during authentication:", data.error);
    }
  })
  .catch((err) => {
    console.error("Failed to connect to the server:", err);
  });

  // Redirect untuk mendukung clean URLs
  const path = window.location.pathname;
  const cleanUrl = path.endsWith('/') ? `${path}assign-role` : `${path}.html`;

  // Redirect jika file statis ditemukan
  fetch(cleanUrl)
    .then((response) => {
      if (response.ok) {
        window.location.href = cleanUrl; // Redirect ke file HTML
      } else {
        document.body.innerHTML = `<h1>404 - Page Not Found</h1>`;
      }
    });

// Fungsi untuk menetapkan role
const assignRole = async (role) => {
  if (!email) {
    alert("Email tidak ditemukan. Silakan coba login ulang.");
    return;
  }

  try {
    // Kirim role ke backend
    const response = await fetch(
      "https://kosconnect-server.vercel.app/auth/assign-role",
      {
        method: "PUT", // Menggunakan PUT untuk update role
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal mengatur role.");
    }
    // Tampilkan notifikasi keberhasilan
    alert("Role berhasil diatur. Silakan login ulang untuk melanjutkan.");
  } catch (error) {
    console.error("Error assigning role:", error);
    alert("Terjadi kesalahan saat mengatur role.");
  }
};

// Event listener untuk button role selection
document.getElementById("user-role").addEventListener("click", () => {
  assignRole("user");
});

document.getElementById("owner-role").addEventListener("click", () => {
  assignRole("owner");
});

// Fungsi untuk menampilkan card pemilihan role saat halaman dimuat
window.addEventListener("DOMContentLoaded", () => {
  // Ambil email dari query parameter yang dikirimkan oleh backend
  const params = new URLSearchParams(window.location.search);
  email = params.get("email");

  if (!email) {
    alert("Email tidak ditemukan. Silakan login ulang.");
    return;
  }

  // Tampilkan card pemilihan role
  document.querySelector(".role-selection").style.display = "block";

  // Bersihkan query parameters dari URL
  window.history.replaceState({}, document.title, "/auth");
});