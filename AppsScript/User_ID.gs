function GetNewGAID() {
  var spreadsheet = SpreadsheetApp.openById(
    "1Y5dWZV0dF9gZmmk4bz6dK0hzlsyu4_ynphwlC1nfwkE"
  );
  var sheet = spreadsheet.getSheetById(1192333235);
  var data = sheet.getRange("A:A").getValues().flat(); // 取得 A 欄所有值並攤平成一維陣列

  var maxGAID = 0; // 記錄最大數值
  var regex = /^GA(\d+)$/; // 正則表達式，用於匹配 GAID 格式，例如 GA13781

  data.forEach(function (value) {
    if (typeof value === "string") {
      // 確保是字串
      var match = value.match(regex);
      if (match) {
        var num = parseInt(match[1], 10); // 解析數值部分
        if (num > maxGAID) {
          maxGAID = num; // 更新最大值
          nextGAID = num + 1; // 更新最大值
        }
      }
    }
  });
  var nextFormatGAID = "GA" + String(nextGAID).padStart(5, "0"); // 確保數字部分至少5位

  Logger.log("目前最大 ID 為" + maxGAID + " ,Return: " + nextFormatGAID); // 在 Apps Script 記錄結果
  return nextFormatGAID; // 也可以回傳結果，方便後續使用
}

function generateGAIDQRCode() {
  var spreadsheet = SpreadsheetApp.openById(
    "1Y5dWZV0dF9gZmmk4bz6dK0hzlsyu4_ynphwlC1nfwkE"
  );
  var sheet = spreadsheet.getSheetById(1192333235);
  var data = sheet.getRange("A2:A" + sheet.getLastRow()).getValues(); // 取得 A 欄 (GAID) 的值，從 A2 開始
  var qrColumn = 10; // QR Code 插入的欄位 (G 欄 = 7)

  for (var i = 0; i < data.length; i++) {
    var gaid = data[i][0]; // 獲取 GAID
    if (!gaid) continue; // 如果欄位是空的，跳過

    // ✅ 使用 QuickChart.io API 生成 QR Code
    var qrUrl =
      "https://quickchart.io/qr?size=150x150&text=" + encodeURIComponent(gaid);

    // **先清除 G 欄的舊圖片，避免重複**
    var cell = sheet.getRange(i + 2, qrColumn);
    var images = sheet.getImages();
    images.forEach((image) => {
      if (image.getAnchorCell().getA1Notation() === cell.getA1Notation()) {
        image.remove();
      }
    });

    // **插入 QR Code 圖片**
    var blob = UrlFetchApp.fetch(qrUrl).getBlob(); // 下載 QR Code 圖片
    sheet.insertImage(blob, qrColumn, i + 2); // 插入圖片到 G 欄
  }
}

function generateUUID() {
  return Utilities.getUuid();
}
