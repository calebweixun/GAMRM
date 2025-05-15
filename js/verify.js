var scriptURL =
  "https://script.google.com/macros/s/AKfycbxjXUF-tnhQHyvJJx4RPEBiymE6SlnZPx6EMDqVnrzUdYi62ROwa46betw0P66ICbT2vA/exec";

function verify_qrscan() {
  // 取得使用者輸入的 email
  var inputEmail = document.getElementById("staff-email").value.trim().toLowerCase();

  // 檢查 email 格式是否正確
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inputEmail)) {
    showErrorNotification("請輸入有效的電子郵件地址！");
    return;
  }

  // 顯示載入指示器或禁用按鈕 (可選)
  // e.g., document.getElementById("verify-button").disabled = true;
  // document.getElementById("loader").style.display = "block";


  fetch(`${scriptURL}?action=verifyStaffEmail&staff_email=${encodeURIComponent(inputEmail)}`, {
    method: 'GET', // Apps Script doGet 預設接收 GET 請求
    mode: 'cors' // 明確指定 CORS 模式
  })
    .then(response => response.json())
    .then(data => {
      // 隱藏載入指示器或啟用按鈕 (可選)
      // document.getElementById("verify-button").disabled = false;
      // document.getElementById("loader").style.display = "none";

      if (data.isValid) {
        // 將 email 保存到 cookie，設置 1 天過期
        setCookie("staff_email", inputEmail, 1);

        // Email 正確，顯示功能選擇區塊和隱藏驗證區塊
        document.getElementById("verify-container").style.display = "none";
        document.getElementById("staff-function-tabs").style.display = "flex";
        document.getElementById("qr-reader").style.display = "block";
        document.getElementById("logo").style.display = "none";

        // 切換顯示訊息
        document.getElementById("verify-message").style.display = "none";
        document.getElementById("scan-message").style.display = "block";

        // 初始化掃描器，並設定為簽到模式
        setGlobalScanMode("signin");
        startScanner();
      } else if (data.error) {
        console.error("Error from Apps Script:", data.error);
        showErrorNotification("驗證過程中發生錯誤，請稍後再試。");
      }
      else {
        // Email 不在允許的列表中，顯示警告訊息
        showErrorNotification("您的 Email 不在授權名單中，拒絕存取！");
      }
    })
    .catch(error => {
      // 隱藏載入指示器或啟用按鈕 (可選)
      // document.getElementById("verify-button").disabled = false;
      // document.getElementById("loader").style.display = "none";
      console.error("Error fetching data from Apps Script:", error);
      showErrorNotification("無法連接到驗證服務，請檢查您的網路連線或稍後再試。");
    });
}

// 設置 cookie 的函數
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 獲取 cookie 的函數
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// 在頁面載入時填充已保存的 email
document.addEventListener("DOMContentLoaded", function () {
  const savedEmail = getCookie("staff_email");
  if (savedEmail) {
    document.getElementById("staff-email").value = savedEmail;
  }
});

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

// 顯示錯誤通知函數
function showErrorNotification(message) {
  // 檢查通知元素是否存在，若不存在則創建
  let errorNotification = document.getElementById("errorNotification");
  if (!errorNotification) {
    errorNotification = document.createElement("div");
    errorNotification.id = "errorNotification";
    errorNotification.className = "notification hidden";
    // 使用內聯樣式確保位置正確
    errorNotification.style.cssText = `
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 90% !important;
      max-width: 350px !important;
      background-color: #fff !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
      padding: 25px 20px !important;
      text-align: center !important;
      z-index: 1200 !important;
    `;

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
