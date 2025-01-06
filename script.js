// Ganti dengan email yang diterima dari hasil login Google (dapat dari response backend)
let email = "";

// Fungsi untuk menangani callback dari Google
const handleGoogleCallback = async () => {
  try {
    // Ambil query parameters dari URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code || !state) {
      alert("Login gagal. Code atau state tidak ditemukan.");
      return;
    }

    // Kirim code dan state ke backend untuk proses token exchange
    const response = await fetch("https://kosconnect-server.vercel.app/auth/callback?code=" + code + "&state=" + state);
    const data = await response.json();

    if (data.status === "role_selection_required") {
      // Simpan email untuk proses assign role
      email = data.email;
      // Tampilkan card pemilihan role
      document.querySelector(".role-selection").style.display = "block";
    } else if (data.message === "Login successful") {
      // Login berhasil, simpan token dan role ke cookie
      document.cookie = `authToken=${data.token}; path=/; secure; HttpOnly;`;
      document.cookie = `userRole=${data.role}; path=/; secure;`;
      alert("Login berhasil. Anda akan diarahkan ke halaman utama.");
      
      // Alihkan pengguna berdasarkan role
      redirectBasedOnRole(data.role);
    } else {
      alert("Terjadi kesalahan: " + data.error);
    }
  } catch (error) {
    console.error("Error during Google callback handling:", error);
    alert("Terjadi kesalahan saat memproses login Google.");
  }
};

// Fungsi untuk menetapkan role
const assignRole = async (role) => {
  if (!email) {
    alert("Email tidak ditemukan. Silakan coba login ulang.");
    return;
  }

  try {
    // Kirim role ke backend
    const response = await fetch("https://kosconnect-server.vercel.app/auth/assign-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getCookie("authToken")}`,  // Menggunakan token dari cookie
      },
      body: JSON.stringify({ email, role }),
    });

    const data = await response.json();
    if (data.message === "Role assigned successfully") {
      alert("Role berhasil diatur. Anda sekarang masuk sebagai " + role);
      // Redirect ke halaman utama setelah role ditetapkan
      redirectBasedOnRole(role);
    } else {
      alert("Gagal mengatur role: " + data.error);
    }
  } catch (error) {
    console.error("Error assigning role:", error);
    alert("Terjadi kesalahan saat mengatur role.");
  }
};

// Fungsi untuk mengarahkan pengguna berdasarkan role
const redirectBasedOnRole = (role) => {
  if (role === "user") {
    window.location.href = "https://kosconnect.github.io/";
  } else if (role === "owner") {
    window.location.href = "https://kosconnect.github.io/dashboard-owner";
  } else if (role === "admin") {
    window.location.href = "https://kosconnect.github.io/dashboard-admin";
  } else {
    alert("Role tidak valid.");
  }
};

// Event listener untuk button role selection
document.getElementById("user-role").addEventListener("click", () => {
  assignRole("user");
});

document.getElementById("owner-role").addEventListener("click", () => {
  assignRole("owner");
});

// Fungsi untuk mengambil nilai cookie berdasarkan nama
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Jalankan fungsi handleGoogleCallback saat halaman dimuat
window.addEventListener("DOMContentLoaded", handleGoogleCallback);
