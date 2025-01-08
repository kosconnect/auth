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