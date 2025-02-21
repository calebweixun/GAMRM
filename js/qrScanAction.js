let html5QrCode;
let data;

async function onScanSuccess(decodedText, decodedResult) {
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
  data = await qrSignIn(decodedText);
}

function startScanner() {
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
    });
}

// 網頁載入時啟動掃描器
window.onload = startScanner;

// 取消按鈕功能
document
  .getElementById("cancel-btn")
  .addEventListener("click", function () {
    // 關閉彈出視窗並清除結果
    const popupWindow = document.getElementById("popup-window");
    popupWindow.classList.remove("visible");
    document.getElementById("query-result").textContent = "";
    // 重新啟動掃描器
    startScanner();
  });

// 簽到按鈕功能
document
  .getElementById("check-in-btn")
  .addEventListener("click", function () {

    console.log("signin", data);

    var rigesterurl =
      `https://docs.google.com/forms/d/e/1FAIpQLSdKJEWd-SzMd542oHoftmsfrUfFBL0RBeLcga62Ztymo9soGQ/viewform?usp=pp_url&entry.672401115=%E9%80%B1%E5%9B%9B%E5%AF%A6%E9%AB%94%E8%81%9A%E9%9B%86&entry.346019688=${data.GAID}`;

    window.open(`${rigesterurl}`, "_blank");
    // 關閉彈出視窗並清除結果
    const popupWindow = document.getElementById("popup-window");
    popupWindow.classList.remove("visible");
    document.getElementById("query-result").textContent = "";
    // 重新啟動掃描器
    startScanner();
  });