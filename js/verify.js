function verifycode() {
  const validPassword = "7k4*Un";

  // 取得使用者輸入的密碼
  var inputPassword = document.getElementById("password").value;

  // 比對密碼是否正確
  if (inputPassword === validPassword) {
    // 密碼正確，跳轉到掃描器頁面
    window.location.href = "verifyQRScan"; // 請依實際路徑修改
  } else {
    // 密碼錯誤，顯示警告訊息
    alert("密碼錯誤，拒絕存取！");
  }
}
