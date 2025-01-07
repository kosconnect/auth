// Ganti dengan email yang diterima dari backend setelah proses login
let email = "";

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
