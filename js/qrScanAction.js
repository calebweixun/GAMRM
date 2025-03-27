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

  // 先停止掃描器
  html5QrCode
    .stop()
    .then(() => {
      console.log("Scanner stopped");
    })
    .catch((err) => {
      console.error("Error stopping scanner", err);
    });

  // 從全局變數獲取當前掃描模式
  const mode = window.currentScanMode || "signin";

  // 顯示處理中通知
  showProcessingNotification("正在獲取用戶資料...");

  try {
    // 查詢用戶資料
    data = await qrSignIn(decodedText);
    data.GAID = decodedText;
    console.log("data", data);

    // 隱藏處理中通知
    const processingNotification = document.getElementById("processingNotification");
    if (processingNotification) {
      processingNotification.classList.remove("show");
      processingNotification.classList.add("hidden");
    }

    // 顯示彈出視窗 - 確保樣式正確
    const popup = document.getElementById("popup-window");
    popup.style.display = "flex";

    // 清除結果區域
    container = document.getElementById("query-result");

    // 使用表格顯示用戶資料，標題置中
    container.innerHTML = `
    <div style="text-align: center; width: 100%;">
      <table style="width: 100%; border-collapse: collapse; margin: 0 auto 15px auto; max-width: 320px;">
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold; width: 40%;">姓名：</td>
          <td style="padding: 5px; text-align: left;">${data.GAID || ""}</td>
        </tr>
      <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold; width: 40%;">姓名：</td>
          <td style="padding: 5px; text-align: left;">${data.Name || ""}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">暱稱：</td>
          <td style="padding: 5px; text-align: left;">${data.NickName || ""}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">身分：</td>
          <td style="padding: 5px; text-align: left;">${data.Role || ""}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">等級：</td>
          <td style="padding: 5px; text-align: left;">${data.Level || ""}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">公會：</td>
          <td style="padding: 5px; text-align: left;">${data.Guild || ""}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">本季簽到次數：</td>
          <td style="padding: 5px; text-align: left;">${data.signInCount || "0"}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">本季購課剩餘：</td>
          <td style="padding: 5px; text-align: left;">${data.purchaseRemaining || "0"}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: right; font-weight: bold;">上次購課日期：</td>
          <td style="padding: 5px; text-align: left;">${data.purchaseDate || "無購買紀錄"}</td>
        </tr>
      </table>
      <p style="margin-top: 10px; font-size: 13px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">${document.getElementById("type-message").textContent}</p>
    </div>
    `;

    // 根據模式顯示相應按鈕
    if (mode === "signin") {
      // 顯示簽到按鈕，隱藏購課按鈕
      document.getElementById("check-in-btn").style.display = "block";
      document.getElementById("purchase-btn").style.display = "none";
    } else if (mode === "purchase") {
      // 隱藏簽到按鈕，顯示購課按鈕
      document.getElementById("check-in-btn").style.display = "none";
      document.getElementById("purchase-btn").style.display = "block";
      // 只有當購課剩餘為無限才隱藏購課按鈕
      if (data.purchaseRemaining === "∞") {
        document.getElementById("purchase-btn").style.display = "none";
      }
    }
  } catch (error) {
    console.error("獲取用戶資料失敗:", error);
    showErrorNotification("獲取用戶資料失敗，請重試");

    // 重新啟動掃描器
    document.getElementById("staff-function-tabs").style.display = "flex";
    startScanner();
  }
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
document.getElementById("cancel-btn").addEventListener("click", function () {
  // 直接隱藏彈出視窗
  document.getElementById("popup-window").style.display = "none";

  // 清除結果
  document.getElementById("query-result").innerHTML = "";

  // 顯示功能按鈕
  document.getElementById("staff-function-tabs").style.display = "flex";

  // 開始掃描器
  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: Math.min(window.innerWidth, window.innerHeight) * 0.7, height: Math.min(window.innerWidth, window.innerHeight) * 0.7 }
      },
      onScanSuccess
    )
    .catch(function (err) {
      console.log(`Unable to start scanning: ${err}`);
    });
});

// 簽到按鈕功能
document
  .getElementById("check-in-btn")
  .addEventListener("click", function () {
    console.log("signin", data);

    // 獲取台北時區的當前日期
    formattedDate = window.getTaipeiDate();
    console.log("Sign-in formattedDate:", formattedDate);

    // 隱藏主要按鈕區域
    const actionButtons = document.querySelector("#popup-window > div > div:nth-child(2)");
    if (actionButtons) {
      actionButtons.style.display = "none";
    }

    // 新增一個簽到表單到結果區域
    const container = document.getElementById("query-result");
    const remarkDiv = document.createElement("div");
    remarkDiv.id = "remark-section";
    remarkDiv.innerHTML = `
      <div style="margin-top: 20px; width: 100%;">
        <h3 style="margin-bottom: 10px;">簽到備註 (選填)</h3>
        <textarea id="check-in-remark" placeholder="請輸入備註內容..." style="width: 90%; min-height: 80px; padding: 10px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ddd;"></textarea>
        <div style="display: flex; justify-content: space-between; gap: 10px;">
          <button id="check-in-confirm" style="flex: 1; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">確認簽到</button>
          <button id="check-in-cancel" style="flex: 1; padding: 10px; background-color: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">取消</button>
        </div>
      </div>
    `;
    container.appendChild(remarkDiv);

    // 確認簽到按鈕的事件
    document.getElementById("check-in-confirm").addEventListener("click", async function () {
      const remark = document.getElementById("check-in-remark").value;
      const staffEmail = document.getElementById("staff-email").value;

      try {
        // 顯示處理中提示
        showProcessingNotification("簽到處理中...");

        // 使用 checkinClass 函數進行簽到
        const result = await checkinClass(staffEmail, data.GAID, "週四實體聚集", remark);

        if (result.success) {
          // 顯示成功通知
          showSuccessNotification("簽到成功！");

          // 關閉備註輸入框
          document.getElementById("remark-section").remove();

          // 關閉彈出視窗並清除結果
          setTimeout(function () {
            document.getElementById("popup-window").style.display = "none";
            document.getElementById("query-result").innerHTML = "";

            // 顯示功能按鈕
            document.getElementById("staff-function-tabs").style.display = "flex";

            // 恢復主要按鈕區域顯示
            if (actionButtons) {
              actionButtons.style.display = "flex";
            }

            // 重新啟動掃描器
            startScanner();
          }, 2000);
        } else {
          // 顯示失敗通知，帶上詳細錯誤信息
          let errorMessage = "簽到處理時發生錯誤";
          if (result.error) {
            errorMessage += "：" + result.error;
          } else if (result.message) {
            errorMessage += "：" + result.message;
          }
          showErrorNotification(errorMessage);

          // 移除備註輸入區域
          document.getElementById("remark-section").remove();

          // 恢復主要按鈕區域顯示
          if (actionButtons) {
            actionButtons.style.display = "flex";
          }

          // 如果結果不成功且有原始響應，顯示調試信息
          if (!result.success && result.rawResponse) {
            showDebugResponse(result);
          }
        }
      } catch (error) {
        console.error("簽到失敗:", error);
        showErrorNotification("簽到處理時發生錯誤，請重試！");

        // 移除備註輸入區域
        document.getElementById("remark-section").remove();

        // 恢復主要按鈕區域顯示
        if (actionButtons) {
          actionButtons.style.display = "flex";
        }
      }
    });

    // 取消簽到按鈕的事件
    document.getElementById("check-in-cancel").addEventListener("click", function () {
      // 移除備註輸入區域
      document.getElementById("remark-section").remove();

      // 恢復主要按鈕區域顯示
      const actionButtons = document.querySelector("#popup-window > div > div:nth-child(2)");
      if (actionButtons) {
        actionButtons.style.display = "flex";
      }
    });
  });

// 購買功能
document
  .getElementById("purchase-btn")
  .addEventListener("click", function () {
    console.log("purchase", data);

    // 獲取台北時區的當前日期
    formattedDate = window.getTaipeiDate();
    console.log("Purchase formattedDate:", formattedDate);

    // 隱藏主要按鈕區域
    const actionButtons = document.querySelector("#popup-window > div > div:nth-child(2)");
    if (actionButtons) {
      actionButtons.style.display = "none";
    }

    // 顯示確認購買的對話框
    const container = document.getElementById("query-result");
    const confirmDiv = document.createElement("div");
    confirmDiv.id = "purchase-confirm-section";
    confirmDiv.innerHTML = `
      <div style="margin-top: 20px; width: 100%;">
        <div style="text-align: center; margin-bottom: 15px;">
          <i class="material-icons" style="font-size: 48px; color: #DC4E33;">payments</i>
          <h3 style="margin: 10px 0; font-size: 18px; font-weight: bold;">確認收費</h3>
          <p style="margin-bottom: 15px;">請確認您已經收到用戶的課程費用？</p>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 10px;">
          <button id="purchase-confirm" style="flex: 1; padding: 10px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">已收到費用</button>
          <button id="purchase-cancel" style="flex: 1; padding: 10px; background-color: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">取消</button>
        </div>
      </div>
    `;
    container.appendChild(confirmDiv);

    // 確認購買按鈕的事件
    document.getElementById("purchase-confirm").addEventListener("click", async function () {
      const staffEmail = document.getElementById("staff-email").value;

      try {
        // 顯示處理中提示
        showProcessingNotification("購買處理中...");

        // 使用 purchaseClass 函數進行購買
        const result = await purchaseClass(staffEmail, data.GAID, "週四實體課程");

        if (result.success) {
          // 顯示成功通知
          showSuccessNotification("購買成功！");

          // 關閉確認對話框
          document.getElementById("purchase-confirm-section").remove();

          // 關閉彈出視窗並清除結果
          setTimeout(function () {
            document.getElementById("popup-window").style.display = "none";
            document.getElementById("query-result").innerHTML = "";

            // 顯示功能按鈕
            document.getElementById("staff-function-tabs").style.display = "flex";

            // 恢復主要按鈕區域顯示
            if (actionButtons) {
              actionButtons.style.display = "flex";
            }

            // 重新啟動掃描器
            startScanner();
          }, 2000);
        } else {
          // 顯示失敗通知，帶上詳細錯誤信息
          let errorMessage = "購買處理時發生錯誤";
          if (result.error) {
            errorMessage += "：" + result.error;
          } else if (result.message) {
            errorMessage += "：" + result.message;
          }
          showErrorNotification(errorMessage);

          // 移除確認對話框
          document.getElementById("purchase-confirm-section").remove();

          // 恢復主要按鈕區域顯示
          if (actionButtons) {
            actionButtons.style.display = "flex";
          }

          // 如果結果不成功且有原始響應，顯示調試信息
          if (!result.success && result.rawResponse) {
            showDebugResponse(result);
          }
        }
      } catch (error) {
        console.error("購買失敗:", error);
        showErrorNotification("購買處理時發生錯誤，請重試！");

        // 移除確認對話框
        document.getElementById("purchase-confirm-section").remove();

        // 恢復主要按鈕區域顯示
        if (actionButtons) {
          actionButtons.style.display = "flex";
        }
      }
    });

    // 取消購買按鈕的事件
    document.getElementById("purchase-cancel").addEventListener("click", function () {
      // 移除確認對話框
      document.getElementById("purchase-confirm-section").remove();

      // 恢復主要按鈕區域顯示
      const actionButtons = document.querySelector("#popup-window > div > div:nth-child(2)");
      if (actionButtons) {
        actionButtons.style.display = "flex";
      }
    });
  });

// 顯示處理中通知函數
function showProcessingNotification(message) {
  // 檢查通知元素是否存在，若不存在則創建
  let processingNotification = document.getElementById("processingNotification");
  if (!processingNotification) {
    processingNotification = document.createElement("div");
    processingNotification.id = "processingNotification";
    processingNotification.className = "notification hidden";
    // 使用內聯樣式確保位置正確
    processingNotification.style.cssText = `
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
    icon.textContent = "hourglass_top";
    icon.style.color = "#3377dc";
    iconDiv.appendChild(icon);
    iconDiv.style.backgroundColor = "white";

    const heading = document.createElement("h2");
    heading.textContent = "處理中";

    const text = document.createElement("p");
    text.id = "processing-message";

    // 添加元素到通知區域
    processingNotification.appendChild(iconDiv);
    processingNotification.appendChild(heading);
    processingNotification.appendChild(text);

    // 添加通知到頁面
    document.body.appendChild(processingNotification);
  }

  // 設置訊息
  document.getElementById("processing-message").textContent = message;

  // 顯示通知
  processingNotification.classList.remove("hidden");
  processingNotification.classList.add("show");
}

// 顯示成功通知函數
function showSuccessNotification(message) {
  // 隱藏處理中通知（如果存在）
  const processingNotification = document.getElementById("processingNotification");
  if (processingNotification) {
    processingNotification.classList.remove("show");
    processingNotification.classList.add("hidden");
  }

  // 檢查通知元素是否存在，若不存在則創建
  let successNotification = document.getElementById("successNotification");
  if (!successNotification) {
    successNotification = document.createElement("div");
    successNotification.id = "successNotification";
    successNotification.className = "notification hidden";
    // 使用內聯樣式確保位置正確
    successNotification.style.cssText = `
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
    icon.textContent = "check_circle";
    icon.style.color = "#229c75";
    iconDiv.appendChild(icon);
    iconDiv.style.backgroundColor = "white";

    const heading = document.createElement("h2");
    heading.textContent = "成功";

    const text = document.createElement("p");
    text.id = "success-message";

    // 添加元素到通知區域
    successNotification.appendChild(iconDiv);
    successNotification.appendChild(heading);
    successNotification.appendChild(text);

    // 添加通知到頁面
    document.body.appendChild(successNotification);
  }

  // 設置成功訊息
  document.getElementById("success-message").textContent = message;

  // 顯示通知
  successNotification.classList.remove("hidden");
  successNotification.classList.add("show");

  // 3秒後淡出通知
  setTimeout(function () {
    successNotification.classList.add("fade-out");

    // 淡出動畫完成後隱藏
    setTimeout(function () {
      successNotification.classList.remove("show");
      successNotification.classList.remove("fade-out");
      successNotification.classList.add("hidden");
    }, 1000);
  }, 2000);
}

// 顯示錯誤通知函數
function showErrorNotification(message) {
  // 隱藏處理中通知（如果存在）
  const processingNotification = document.getElementById("processingNotification");
  if (processingNotification) {
    processingNotification.classList.remove("show");
    processingNotification.classList.add("hidden");
  }

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
    icon.textContent = "error";
    icon.style.color = "#f44336";
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
  }, 2000);
}

// 顯示原始響應的調試函數
function showDebugResponse(response) {
  // 僅在開發環境使用
  console.log("Debug response:", response);

  // 創建調試面板
  let debugPanel = document.getElementById("debugPanel");
  if (!debugPanel) {
    debugPanel = document.createElement("div");
    debugPanel.id = "debugPanel";
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
    `;

    // 添加標題和關閉按鈕
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    `;

    const title = document.createElement("span");
    title.textContent = "調試信息";
    title.style.fontWeight = "bold";

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✕";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = function () {
      debugPanel.style.display = "none";
    };

    header.appendChild(title);
    header.appendChild(closeBtn);
    debugPanel.appendChild(header);

    // 添加內容區域
    const content = document.createElement("pre");
    content.id = "debugContent";
    content.style.cssText = `
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    `;
    debugPanel.appendChild(content);

    document.body.appendChild(debugPanel);
  } else {
    debugPanel.style.display = "block";
  }

  // 更新調試內容
  const content = document.getElementById("debugContent");
  content.textContent = JSON.stringify(response, null, 2);
}

