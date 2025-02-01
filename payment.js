// Tangkap URL setelah pembayaran
const urlParams = new URLSearchParams(window.location.search);
const transactionStatus = urlParams.get("transaction_status");
const transactionId = urlParams.get("order_id"); // Atau sesuaikan dengan response Midtrans

// Cek status pembayaran
if (transactionStatus === "settlement") {
  // Jika pembayaran berhasil, arahkan ke halaman invoice
  window.location.href = `https://kosconnect.github.io/invoice.html?transaction_id=${transactionId}`;
} else {
  // Jika pembayaran gagal atau pending, arahkan ke history
  window.location.href = "https://kosconnect.github.io/history.html";
}