
// 根據 email 查找使用者資料
function getUserInfoByEmail(email) {
  var spreadsheet = SpreadsheetApp.openById('1Y5dWZV0dF9gZmmk4bz6dK0hzlsyu4_ynphwlC1nfwkE');
  var sheet = spreadsheet.getSheetById(1192333235);
  var emailColumn = 2;

  // 使用 TextFinder 查找 email 所在的單元格
  var range = sheet.getRange(1, emailColumn, sheet.getLastRow(), 1);
  var textFinder = range.createTextFinder(email);
  var foundCell = textFinder.findNext();

  if (!foundCell) {
    return { Status: 'Not Found' };
  }

  var rowIndex = foundCell.getRow();
  var userInfo = sheet.getRange(rowIndex, 1, 1, 11).getValues();

  if (!userInfo || userInfo.length === 0 || userInfo[0].length < 9) {
    return {
      Status: 'Error',
      Message: 'User information is incomplete or invalid'
    };
  }

  var action = getUserActionByGAID(userInfo[0][0]);
  if(userInfo[0][8]!=''){
    remaining = "∞";
  }else{
    remaining = userInfo[0][10];
  }

  return {
    Status: 'OK',
    GAID: userInfo[0][0],
    Email: userInfo[0][1],
    Name: userInfo[0][2],
    NickName: userInfo[0][3],
    Phone: userInfo[0][4],
    LINEID: userInfo[0][5],
    Guild: userInfo[0][6],
    Role: userInfo[0][7],
    Level: userInfo[0][8],
    signInCount: userInfo[0][9],
    purchaseRemaining: remaining,
    Give: action.Give,
    Care: action.Care,
    Empower: action.Empower,
    Do: action.Do,
    Love: action.Love,
    Grow: action.Grow,
    Share: action.Share,
  };
}

// 更新資料
function updateUserInfo(email, name, nickname, phone, lineId, guild) {
  var spreadsheet = SpreadsheetApp.openById('1Y5dWZV0dF9gZmmk4bz6dK0hzlsyu4_ynphwlC1nfwkE');
  var sheet = spreadsheet.getSheetById(1192333235);
  var emailColumn = 2;

  var range = sheet.getRange(1, emailColumn, sheet.getLastRow(), 1);
  var textFinder = range.createTextFinder(email);
  var foundCell = textFinder.findNext();

  if (!foundCell) {
    return { status: 'Error', message: 'Email not found' };
  }

  var rowIndex = foundCell.getRow();
  // sheet.getRange(rowIndex, 1).setValue(gaid);        // 更新 GAID
  sheet.getRange(rowIndex, 3).setValue(name);       // 更新姓名
  sheet.getRange(rowIndex, 4).setValue(nickname);   // 更新暱稱
  sheet.getRange(rowIndex, 5).setValue("'" + phone); // 更新電話
  sheet.getRange(rowIndex, 6).setValue(lineId);     // 更新 LINE ID
  sheet.getRange(rowIndex, 7).setValue(guild);      // 更新所在公會
  // sheet.getRange(rowIndex, 8).setValue(role);       // 更新身分別
  // sheet.getRange(rowIndex, 9).setValue(level);      // 更新 GA 等級

  return { Status: 'OK' };
}

function createUser(email, name, nickname, phone, lineId, guild) {
  try {
    var spreadsheet = SpreadsheetApp.openById('1Y5dWZV0dF9gZmmk4bz6dK0hzlsyu4_ynphwlC1nfwkE');
    var sheet = spreadsheet.getSheetById(1192333235);
    var sheet_signin = spreadsheet.getSheetById(1272498499);
    var gaid = GetNewGAID(); // 產生新的 GAID
    var lastRow = sheet.getLastRow() + 1;

    // 確保電話欄位為文字格式
    var formattedPhone = phone ? "'" + phone : "";

    // 插入新使用者資料
    sheet.getRange(lastRow, 1, 1, 8).setValues([
      [gaid, email, name, nickname, formattedPhone, lineId, guild, '訪客']
    ]);

    return { Status: "Success", Message: "使用者資料已建立", GAID: gaid };

  } catch (error) {
    return { Status: "Error", Message: error.toString() };
  }
}

