# GAMRM - GA 行銷社群資源管理系統

GAMRM (GA Marketing Resource Management) 是一個為 GA 行銷社群設計的資源管理系統，提供會員管理、簽到、課程購買等功能。系統採用 HTML、CSS 和 JavaScript 開發，後端使用 Google Apps Script 和 Google 表單進行資料處理。

## 系統架構

```
GAMRM/
├── index.html         - 主頁面，入口網站
├── css/               - 樣式檔案
├── js/                - JavaScript 腳本
├── img/               - 圖片資源
├── AppsScript/        - Google Apps Script 後端程式碼
├── staffScaner/       - 工作人員掃描系統
├── userQRshow/        - 用戶 QR 碼顯示
├── userProfileEdit/   - 用戶資料編輯
├── userCreate/        - 新用戶註冊
└── userImgEdit/       - 用戶頭像編輯
```

## 頁面功能關係

### 1. 入口頁面 (index.html)

主要提供兩個入口：
- **新朋友專區**：引導新用戶註冊和加入 LINE 群組
- **GA 人專區**：提供會員功能，包括 QR 碼查詢、個人資料編輯等
- **工作人員專區**：提供工作人員專用功能

```
入口頁面
 ├── 新朋友專區 ──→ 註冊加入GA ──→ userCreate/
 │                └→ 加入LINE群組
 │
 └── GA人專區   ──→ 個人QR與Action查詢 ──→ userQRshow/
                 ├→ 個人資料修改/維護 ──→ userProfileEdit/
                 ├→ 個人大頭貼上傳 ──→ (Google表單)
                 ├→ GA Action行動達成回報 ──→ (Google表單)
                 └→ 工作人員專用掃描系統 ──→ staffScaner/
```

### 2. 用戶相關功能

#### 2.1 用戶創建 (userCreate/)

- 提供新用戶註冊表單
- 收集基本資訊：姓名、暱稱、Email、手機等
- 建立新的 GAID 識別碼
- 資料存入 Google Sheet 資料庫

#### 2.2 用戶 QR 碼查詢 (userQRshow/)

- 用戶輸入 Email 查詢個人資料
- 顯示個人 QR 碼，用於實體活動簽到
- 顯示 GA Action 相關資訊

#### 2.3 用戶資料編輯 (userProfileEdit/)

- 用戶輸入 Email 獲取個人資料
- 允許修改基本資訊：暱稱、手機、LINE ID、所屬公會等
- 更新 Google Sheet 中的資料

#### 2.4 用戶頭像編輯 (userImgEdit/)

- 用戶上傳個人頭像
- 裁剪和調整頭像尺寸
- 將頭像存入系統

### 3. 工作人員功能

#### 3.1 掃描系統 (staffScaner/)

- 工作人員登入驗證
- QR 碼掃描功能，用於：
  - 活動簽到：記錄用戶參與活動
  - 課程購買：記錄用戶購買課程
- 即時顯示用戶資訊（身分、等級、簽到次數、購課餘額等）
- 自動生成 Google 表單連結進行資料提交

## 資料流程

```
用戶註冊/編輯 ──→ 前端表單 ──→ gasService.js ──→ Google Apps Script ──→ Google Sheet
                                                                        ↑
用戶查詢     ──→ 前端請求 ──→ gasService.js ────────────────────────────┘
                                                                        ↑
工作人員掃描 ──→ QR掃描 ──→ qrScanAction.js ──→ gasService.js ─────────┘
```

## 技術說明

### 前端技術

- **HTML5/CSS3**：頁面結構與樣式
- **JavaScript**：前端交互邏輯
- **HTML5-QR-Code**：QR 碼掃描功能
- **Google Fonts/Icons**：字體與圖標資源

### 後端技術

- **Google Apps Script**：作為後端 API 服務
- **Google Sheets**：資料庫儲存用戶資訊
- **Google Forms**：表單提交與資料收集

### 主要 JavaScript 文件

- **gasService.js**：與 Google Apps Script 通訊
- **qrScanAction.js**：處理 QR 碼掃描動作
- **verify.js**：驗證和權限控制

### 資料模型

用戶資料主要包含：
- GAID (GA 識別碼)
- 姓名、暱稱
- 聯絡資訊 (Email、手機、LINE ID)
- 身分類別、GA 等級
- 所屬公會
- 簽到記錄、購課餘額

## 使用流程

### 新用戶流程

1. 進入首頁，點擊「註冊加入GA」
2. 填寫個人資料並提交
3. 系統生成 GAID，用戶成為 GA 會員
4. 加入 LINE 群組獲取最新活動資訊

### 現有會員流程

1. 進入首頁，切換到「GA人專用」頁籤
2. 選擇需要的功能（QR碼查詢、資料修改等）
3. 使用 Email 驗證身份
4. 執行相應操作

### 工作人員流程

1. 進入「工作人員專用掃描系統」
2. 輸入工作人員密碼驗證
3. 選擇操作模式（簽到/購課）
4. 掃描用戶 QR 碼
5. 確認用戶資訊後執行對應操作

## 維護與更新

### 日常維護

- Google Sheets 資料檢查和備份
- 密碼定期更新
- 功能測試與錯誤報告

### 未來擴展

- 會員等級系統完善
- 活動管理功能
- 數據統計與分析
- 整合線上支付系統

## 安全考量

- 密碼驗證保護工作人員功能
- 僅顯示必要的用戶資訊
- Google Apps Script 服務的安全限制
- 敏感資料加密存儲

## 專案負責人

- 2025 GA 資訊組 