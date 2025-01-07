// Ganti dengan email yang diterima dari backend setelah proses login
// let email = "";

// Get query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const role = urlParams.get('role');
const id = urlParams.get('id');

// Send data to the backend
fetch("https://kosconnect-server.vercel.app/auth/googleauth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, role, id }),
})
  .then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      // Redirect user based on their role
      switch (role) {
        case "user":
          window.location.href = "https://kosconnect.github.io/";
          break;
        case "owner":
          window.location.href = "https://kosconnect.github.io/dashboard-owner";
          break;
        case "admin":
          window.location.href = "https://kosconnect.github.io/dashboard-admin";
          break;
        default:
          console.error("Unknown role:", role);
          break;
      }
    } else {
      // Handle error (e.g., invalid data or server error)
      console.error("Error during authentication:", data.error);
    }
  })
  .catch((err) => {
    console.error("Failed to connect to the server:", err);
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

    const data = await response.json();
    if (data.message === "Role assigned successfully") {
      alert("Role berhasil diatur. Anda sekarang masuk sebagai " + role);

      // Redirect berdasarkan role
      if (role === "user") {
        window.location.href = "https://kosconnect.github.io/";
      } else if (role === "owner") {
        window.location.href = "https://kosconnect.github.io/dashboard-owner";
      } else {
        alert("Role tidak valid. Silakan hubungi administrator.");
      }
    } else {
      alert("Gagal mengatur role: " + data.error);
    }
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
