function verify_qrscan() {
  const validPassword = "7k4*Un";

  // 取得使用者輸入的密碼
  var inputPassword = document.getElementById("password").value;

  // 比對密碼是否正確
  if (inputPassword === validPassword) {
    // 密碼正確，顯示功能選擇區塊和隱藏驗證區塊
    document.getElementById("verify-container").style.display = "none";
    document.getElementById("staff-function-tabs").style.display = "flex";
    document.getElementById("qr-reader").style.display = "block";

    // 切換顯示訊息
    document.getElementById("verify-message").style.display = "none";
    document.getElementById("scan-message").style.display = "block";

    // 初始化掃描器，並設定為簽到模式
    setGlobalScanMode("signin");
    startScanner();
  } else {
    // 密碼錯誤，顯示警告訊息
    showErrorNotification("密碼錯誤，拒絕存取！");
  }
}

// 切換掃描模式
function switchScanMode(mode) {
  // 將所有功能按鈕恢復為非活動狀態
  document.querySelectorAll(".function-tab-button").forEach((button) => {
    button.classList.remove("active");
  });

  // 設定選中的功能按鈕為活動狀態
  event.currentTarget.classList.add("active");

  // 使用全局方法設置掃描模式
  setGlobalScanMode(mode);

  // 如果掃描器已停止，重新啟動掃描器
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      startScanner();
    }).catch((err) => {
      console.error("Error stopping scanner", err);
      startScanner();
    });
  } else {
    startScanner();
  }
}

// 覆寫原本的 onScanSuccess 函數
async function onScanSuccess(decodedText, decodedResult) {
  // 隱藏功能按鈕
  document.getElementById("staff-function-tabs").style.display = "none";

  // 顯示彈出式視窗
  const popupWindow = document.getElementById("popup-window");
  popupWindow.classList.add("visible");
  container = document.getElementById("query-result");

  html5QrCode
    .stop()
    .then(() => {
      console.log("Scanner stopped");
    })
    .catch((err) => {
      console.error("Error stopping scanner", err);
    });

  // 獲取當前掃描模式
  const mode = window.currentScanMode || "signin";

  // 根據當前掃描模式執行不同的處理邏輯
  if (mode === "signin") {
    // 簽到模式
    data = await qrSignIn(decodedText);
    // 顯示簽到按鈕，隱藏購課按鈕
    document.getElementById("check-in-btn").style.display = "block";
    document.getElementById("purchase-btn").style.display = "none";
  } else if (mode === "purchase") {
    // 購課模式
    data = await qrSignIn(decodedText); // 可以共用獲取資料的函數
    // 隱藏簽到按鈕，顯示購課按鈕
    document.getElementById("check-in-btn").style.display = "none";
    document.getElementById("purchase-btn").style.display = "block";
  }
}

// 顯示錯誤通知函數
function showErrorNotification(message) {
  // 檢查通知元素是否存在，若不存在則創建
  let errorNotification = document.getElementById("errorNotification");
  if (!errorNotification) {
    errorNotification = document.createElement("div");
    errorNotification.id = "errorNotification";
    errorNotification.className = "notification hidden";

    // 創建通知內容
    const iconDiv = document.createElement("div");
    iconDiv.className = "notification-icon";
    const icon = document.createElement("i");
    icon.className = "material-icons";
    icon.textContent = "error_outline";
    icon.style.color = "#DC4E33";
    iconDiv.appendChild(icon);
    iconDiv.style.backgroundColor = "white";

    const heading = document.createElement("h2");
    heading.textContent = "錯誤";

    const text = document.createElement("p");
    text.id = "error-message";

    // 添加元素到通知區域
    errorNotification.appendChild(iconDiv);
    errorNotification.appendChild(heading);
    errorNotification.appendChild(text);

    // 添加通知到頁面
    document.body.appendChild(errorNotification);
  }

  // 設置錯誤訊息
  document.getElementById("error-message").textContent = message;

  // 顯示通知
  errorNotification.classList.remove("hidden");
  errorNotification.classList.add("show");

  // 3秒後淡出通知
  setTimeout(function () {
    errorNotification.classList.add("fade-out");

    // 淡出動畫完成後隱藏
    setTimeout(function () {
      errorNotification.classList.remove("show");
      errorNotification.classList.remove("fade-out");
      errorNotification.classList.add("hidden");
    }, 1000);
  }, 3000);
}
