function getUserInfoByGAID(id) {
  var spreadsheet = SpreadsheetApp.openById(
    "1Y5dWZV0dF9gZmmk4bz6dK0hzlsyu4_ynphwlC1nfwkE"
  );
  var sheet = spreadsheet.getSheetById(1192333235);
  var gaidColumn = 1;

  // 使用 TextFinder 查找 email 所在的單元格
  var range = sheet.getRange(1, gaidColumn, sheet.getLastRow(), 1);
  var textFinder = range.createTextFinder(id);
  var foundCell = textFinder.findNext();

  if (!foundCell) {
    return { Status: "Not Found" };
  }

  var rowIndex = foundCell.getRow();
  var userInfo = sheet.getRange(rowIndex, 1, 1, 10).getValues();

  if (!userInfo || userInfo.length === 0 || userInfo[0].length < 9) {
    return {
      Status: "Error",
      Message: "User information is incomplete or invalid",
    };
  }

  return {
    Status: "OK",
    GAID: userInfo[0][0],
    // Email: userInfo[0][1],
    Name: userInfo[0][2],
    NickName: userInfo[0][3],
    // Phone: userInfo[0][4],
    // LINEID: userInfo[0][5],
    Guild: userInfo[0][6],
    Role: userInfo[0][7],
    Level: userInfo[0][8],
    signInCount: userInfo[0][9],
  };
}
