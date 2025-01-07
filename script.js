// Ganti dengan email yang diterima dari backend setelah proses login
let email = "";

// // Ketika callback dari Google OAuth diterima
// fetch("https://kosconnect-server.vercel.app/auth/callback", {
//   method: "GET", // atau POST jika diperlukan
//   credentials: "include", // Sertakan cookie
// })
//   .then((response) => {
//     if (!response.ok) {
//       return response.json().then((errorData) => {
//         throw new Error(errorData.error || "Authentication failed");
//       });
//     }
//     return response.json();
//   })
//   .then((data) => {
//     if (data.token && data.role) {
//       // Simpan token dan role di cookie
//       document.cookie = `authToken=${data.token}; path=/; secure;`;
//       document.cookie = `userRole=${data.role}; path=/; secure;`;

//       // Redirect ke halaman sesuai role
//       if (data.role === "user") {
//         window.location.href = "https://kosconnect.github.io/";
//       } else if (data.role === "owner") {
//         window.location.href = "https://kosconnect.github.io/dashboard-owner";
//       } else if (data.role === "admin") {
//         window.location.href = "https://kosconnect.github.io/dashboard-admin";
//       } else {
//         console.error("Invalid role");
//         alert("Role tidak valid. Silakan hubungi administrator.");
//       }
//     } else {
//       console.error("Missing token or role");
//       alert("Token atau role tidak ditemukan. Silakan coba lagi.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error during OAuth callback:", error);
//     alert("Authentication failed. Please try again.");
//   });

// fetch("https://kosconnect-server.vercel.app/auth/callback", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   credentials: "include",
// })
//   .then((response) => {
//     if (!response.ok) {
//       return response.json().then((errorData) => {
//         throw new Error(errorData.message || "Periksa kredensial Anda.");
//       });
//     }
//     return response.json();
//   })
//   .then((result) => {
//     if (result.token && result.role) {
//       // Simpan token ke HttpOnly cookie (untuk keamanan)
//       document.cookie = `authToken=${result.token}; SameSite=Strict; Secure; HttpOnly; path=/`;
//       // Simpan role ke cookie (kurang sensitif)
//       document.cookie = `userRole=${result.role}; SameSite=Strict; Secure; path=/`;

//       // Redirect ke halaman sesuai role tanpa mengecek status 200
//       if (result.role === "user") {
//         window.location.href = "https://kosconnect.github.io/";
//       } else if (result.role === "owner") {
//         window.location.href = "https://kosconnect.github.io/dashboard-owner";
//       } else if (result.role === "admin") {
//         window.location.href = "https://kosconnect.github.io/dashboard-admin";
//       } else {
//         console.error("Invalid role");
//         alert("Role tidak valid. Silakan hubungi administrator.");
//       }
//     } else {
//       console.error("Missing token or role");
//       alert("Token atau role tidak ditemukan. Silakan coba lagi.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error during OAuth callback:", error);
//     alert("Authentication failed. Please try again.");
//   });

// // Fungsi untuk menetapkan role
// const assignRole = async (role) => {
//   if (!email) {
//     alert("Email tidak ditemukan. Silakan coba login ulang.");
//     return;
//   }

//   try {
//     // Kirim role ke backend
//     const response = await fetch(
//       "https://kosconnect-server.vercel.app/auth/assign-role",
//       {
//         method: "PUT", // Menggunakan PUT untuk update role
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, role }),
//       }
//     );

//     const data = await response.json();
//     if (data.message === "Role assigned successfully") {
//       alert("Role berhasil diatur. Anda sekarang masuk sebagai " + role);
//     } else {
//       alert("Gagal mengatur role: " + data.error);
//     }
//   } catch (error) {
//     console.error("Error assigning role:", error);
//     alert("Terjadi kesalahan saat mengatur role.");
//   }
// };

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (code && state) {
    fetch("https://kosconnect-server.vercel.app/auth/callback?code=" + code + "&state=" + state, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Login gagal");
          });
        }
        return response.json();
      })
      .then((result) => {
        if (result.token && result.role) {
          // Simpan token dan role ke cookie
          document.cookie = `authToken=${result.token}; path=/; secure;`;
          document.cookie = `userRole=${result.role}; path=/; secure;`;

          // Redirect berdasarkan role
          if (result.role === "user") {
            window.location.href = "https://kosconnect.github.io/";
          } else if (result.role === "owner") {
            window.location.href = "https://kosconnect.github.io/dashboard-owner";
          } else if (result.role === "admin") {
            window.location.href = "https://kosconnect.github.io/dashboard-admin";
          } else {
            alert("Role tidak valid.");
          }
        }
      })
      .catch((error) => {
        alert(error.message);
      });
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

    const data = await response.json();
    if (data.message === "Role assigned successfully") {
      alert("Role berhasil diatur. Anda sekarang masuk sebagai " + role);
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