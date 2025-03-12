function verifycode() {
  const validPassword = "7k4*Un";

  // 取得使用者輸入的密碼
  var inputPassword = document.getElementById("password").value;

  // 比對密碼是否正確
  if (inputPassword === validPassword) {
    // 密碼正確，顯示掃描器並隱藏驗證區塊
    document.getElementById("verify-container").style.display = "none";
    document.getElementById("qr-reader").style.display = "block";

    // 切換顯示訊息
    document.getElementById("verify-message").style.display = "none";
    document.getElementById("scan-message").style.display = "block";

    // 初始化掃描器
    if (typeof initializeScanner === "function") {
      initializeScanner();
    }
  } else {
    // 密碼錯誤，顯示警告訊息
    alert("密碼錯誤，拒絕存取！");
  }
}
