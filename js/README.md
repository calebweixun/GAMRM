# GAMRM JavaScript 程式碼說明文件

本專案使用多個 JavaScript 檔案來實現各種功能，以下是各個 JS 文件的功能說明。

## 文件結構

```
js/
├── html5-qrcode.min.js - QR Code 掃描核心函式庫
├── gasService.js      - Google Apps Script 服務介接
├── qrScanAction.js    - QR 掃描動作處理
├── verify.js          - 人員驗證與功能切換
└── qrScanAction.js.bak - 備份檔案
```

## html5-qrcode.min.js

第三方開源函式庫，提供 HTML5 QR Code 掃描功能。

- 來源: [mebjas/html5-qrcode](https://github.com/mebjas/html5-qrcode)
- 主要功能: 使用裝置相機掃描 QR Code
- 核心類: `Html5Qrcode`

## gasService.js

負責與 Google Apps Script 後端服務通訊的模組，處理資料存取與查詢。

### 主要功能

1. **資料查詢功能**
   - `qrSignIn(gaid)` - 根據掃描的 GAID 獲取用戶資訊
   - `searchUserData(event)` - 根據 Email 搜尋用戶資料

2. **資料顯示功能**
   - `displayData(data)` - 顯示用戶資料用於編輯
   - `qrShow(data)` - 顯示用戶 QR Code

3. **資料管理功能**
   - `updateUserData()` - 更新用戶資料
   - `isEmailDuplicate()` - 檢查 Email 是否重複
   - `createUserData()` - 創建新用戶資料

### 資料格式

處理的用戶資料包括：
- GAID - 用戶唯一識別碼
- 姓名、暱稱
- 手機、LINE ID
- 身分別、等級
- 所屬公會
- 簽到次數、購課餘額

## qrScanAction.js

處理 QR Code 掃描後的動作與流程控制。

### 主要功能

1. **掃描處理**
   - `onScanSuccess(decodedText, decodedResult)` - 掃描成功後的處理
   - `startScanner()` - 啟動掃描器
   - `initializeScanner()` - 初始化掃描器實例

2. **按鈕事件處理**
   - 簽到按鈕功能 - 掃描後執行簽到
   - 購買按鈕功能 - 掃描後執行購課
   - 取消按鈕功能 - 取消當前操作並重啟掃描

### 全局變數

- `html5QrCode` - 掃描器實例
- `data` - 當前掃描到的用戶資料
- `formattedDate` - 格式化的當前日期 (台北時間)
- `window.currentScanMode` - 當前掃描模式 ("signin" 或 "purchase")

## verify.js

處理人員驗證與功能模式切換。

### 主要功能

1. **驗證功能**
   - `verify_qrscan()` - 驗證招待人員密碼
   - `showErrorNotification(message)` - 顯示錯誤通知

2. **模式切換**
   - `switchScanMode(mode)` - 切換掃描模式 (簽到/購課)
   - `onScanSuccess(decodedText, decodedResult)` - 根據模式處理掃描結果

### 驗證流程

1. 招待人員輸入密碼
2. 驗證成功後顯示功能頁籤
3. 選擇功能 (簽到/購課)
4. 掃描 QR Code 執行相應操作

## 頁面交互流程

1. **開始階段**
   - 載入頁面後要求輸入招待人員密碼
   - 密碼驗證後顯示功能選項

2. **掃描階段**
   - 選擇簽到或購課模式
   - 啟動相機掃描 QR Code
   - 顯示掃描結果

3. **執行階段**
   - 根據選擇的模式執行簽到或購課
   - 透過表單 URL 提交資料
   - 完成後重新啟動掃描器

## 主要依賴關係

- `verify.js` -> `qrScanAction.js` -> `gasService.js`
- QR 掃描部分依賴 `html5-qrcode.min.js`
- 後端資料存取依賴 Google Apps Script 服務

## 維護與更新

1. **新增功能**
   - 建議在各自對應的文件中添加，保持功能模組化
   - 新功能需更新全局變數和事件監聽器

2. **調試提示**
   - 使用 Console 輸出 (`console.log`) 查看掃描過程中的資料流
   - 檢查網絡請求以確認與 Google Apps Script 的通訊狀態

3. **安全考量**
   - 密碼驗證應定期更新
   - 敏感資料不應直接存儲在前端代碼中
   - 考慮加入會話超時機制

## 未來優化方向

1. 添加離線模式支援
2. 改善錯誤處理機制
3. 增強使用者界面回饋
4. 優化移動設備的性能
5. 整合更多統計與報表功能 