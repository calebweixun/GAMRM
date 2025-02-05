const validPassword = "7k4*Un";

document
  .getElementById("verifyBtn")
  .addEventListener("click", function () {
    const inputPassword = document.getElementById("password").value;
    if (inputPassword === validPassword) {
      window.location.href = "userQRScan.html";
    } else {
      alert("密碼錯誤，拒絕存取！");
    }
  });