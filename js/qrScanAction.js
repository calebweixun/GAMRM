let html5QrCode;
let data;
let formattedDate;

// 初始化時設置全局模式變數（如果尚未設置）
if (typeof window.currentScanMode === 'undefined') {
  window.currentScanMode = "signin";
}

async function onScanSuccess(decodedText, decodedResult) {
  // 獲取台北時區的當前日期
  formattedDate = window.getTaipeiDate();
  console.log("Scan success formattedDate:", formattedDate);

  // 隱藏功能按鈕
  document.getElementById("staff-function-tabs").style.display = "none";

  // 顯示彈出式視窗
  const popupWindow = document.getElementById("popup-window");
  popupWindow.classList.add("visible");
  container = document.getElementById("query-result");

  // 從全局變數獲取當前掃描模式
  const mode = window.currentScanMode || "signin";

  // 查詢用戶資料
  data = await qrSignIn(decodedText);
  console.log("data", data);

  // 根據模式顯示相應按鈕
  if (mode === "signin") {
    // 顯示簽到按鈕，隱藏購課按鈕
    document.getElementById("check-in-btn").style.display = "block";
    document.getElementById("purchase-btn").style.display = "none";
  } else if (mode === "purchase") {
    // 隱藏簽到按鈕，顯示購課按鈕
    if (data.purchaseRemaining === "∞") {
      document.getElementById("purchase-btn").style.display = "none";
    } else {
      document.getElementById("purchase-btn").style.display = "block";
    }
    document.getElementById("check-in-btn").style.display = "none";

  }
  html5QrCode
    .stop()
    .then(() => {
      console.log("Scanner stopped");
    })
    .catch((err) => {
      console.error("Error stopping scanner", err);
    });
}

function startScanner() {
  // 確保掃描器元素可見
  document.getElementById("qr-reader").style.display = "block";

  // 先確認是否已經存在掃描器實例，如果存在則先停止
  if (html5QrCode) {
    try {
      html5QrCode.stop().then(() => {
        console.log("Previous scanner stopped");
        initializeScanner();
      }).catch((err) => {
        console.error("Error stopping previous scanner:", err);
        initializeScanner();
      });
    } catch (error) {
      console.error("Error handling previous scanner:", error);
      initializeScanner();
    }
  } else {
    initializeScanner();
  }
}

// 初始化掃描器實例
function initializeScanner() {
  // 清空掃描器容器，防止多個實例
  const qrReader = document.getElementById("qr-reader");
  qrReader.innerHTML = "";

  html5QrCode = new Html5Qrcode("qr-reader");
  const qrboxSize = Math.min(window.innerWidth, window.innerHeight) * 0.7;

  html5QrCode
    .start(
      { facingMode: "environment" }, // 使用後置相機
      {
        fps: 10, // 每秒10次掃描
        qrbox: { width: qrboxSize, height: qrboxSize }, // 根據螢幕大小調整 QR 碼框的大小
      },
      onScanSuccess
    )
    .catch((err) => {
      console.error("Failed to start the QR code scanner:", err);
      showErrorNotification("啟動掃描器失敗，請重新載入頁面");
    });
}

// 取消按鈕功能
document
  .getElementById("cancel-btn")
  .addEventListener("click", function () {
    // 關閉彈出視窗並清除結果
    const popupWindow = document.getElementById("popup-window");
    popupWindow.classList.remove("visible");
    document.getElementById("query-result").textContent = "";

    // 顯示功能按鈕
    document.getElementById("staff-function-tabs").style.display = "flex";

    // 重新啟動掃描器
    startScanner();
  });

// 簽到按鈕功能
document
  .getElementById("check-in-btn")
  .addEventListener("click", function () {
    console.log("signin", data);

    // 獲取台北時區的當前日期
    formattedDate = window.getTaipeiDate();
    console.log("Sign-in formattedDate:", formattedDate);

    var rigesterurl =
      `https://docs.google.com/forms/d/e/1FAIpQLSdKJEWd-SzMd542oHoftmsfrUfFBL0RBeLcga62Ztymo9soGQ/viewform?usp=pp_url&entry.672401115=%E9%80%B1%E5%9B%9B%E5%AF%A6%E9%AB%94%E8%81%9A%E9%9B%86&entry.346019688=${data.GAID}&entry.894246817=${formattedDate}`;

    window.open(`${rigesterurl}`, "_blank");
    // 關閉彈出視窗並清除結果
    const popupWindow = document.getElementById("popup-window");
    popupWindow.classList.remove("visible");
    document.getElementById("query-result").textContent = "";

    // 顯示功能按鈕
    document.getElementById("staff-function-tabs").style.display = "flex";

    // 重新啟動掃描器
    startScanner();
  });

// 購買功能
document
  .getElementById("purchase-btn")
  .addEventListener("click", function () {
    console.log("purchase", data);

    // 獲取台北時區的當前日期
    formattedDate = window.getTaipeiDate();
    console.log("Purchase formattedDate:", formattedDate);

    var rigesterurl =
      `https://docs.google.com/forms/d/e/1FAIpQLSe7Sk90et8ri51WJ9VISW__Ibx9oDrRMwqHTrLu-qQbCDXyPw/viewform?usp=pp_url&entry.1346556926=%E9%80%B1%E5%9B%9B%E5%AF%A6%E9%AB%94%E8%81%9A%E9%9B%86&entry.493868752=${data.GAID}&entry.894246817=${formattedDate}`;

    window.open(`${rigesterurl}`, "_blank");

    // 關閉彈出視窗並清除結果
    const popupWindow = document.getElementById("popup-window");
    popupWindow.classList.remove("visible");
    document.getElementById("query-result").textContent = "";

    // 顯示功能按鈕
    document.getElementById("staff-function-tabs").style.display = "flex";

    // 重新啟動掃描器
    startScanner();
  });

