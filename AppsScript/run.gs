// doGet 為被呼叫的主要程序，在經由action確認意圖並回應。
function doGet(e) {
  var action = e.parameter.action;
  var email = e.parameter.email;

  // 如果是 OPTIONS 請求，直接返回空的回應
  if (e.method == "OPTIONS") {
    return ContentService.createTextOutput('');
  }

  // 根據 action 判斷請求的動作
  if (action === 'getUserInfo') {
    var result = getUserInfoByEmail(email);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } else if (action === 'updateUserInfo') {
    var name = e.parameter.name;
    var nickname = e.parameter.nickname;
    var phone = e.parameter.phone;
    var lineId = e.parameter.lineId;
    // var gaid = e.parameter.gaid;
    var guild = e.parameter.guild;
    // var role = e.parameter.role;
    // var level = e.parameter.level;
    var result = updateUserInfo(email, name, nickname, phone, lineId, guild);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } else if (action ==='createUser') {
    var name = e.parameter.name;
    var nickname = e.parameter.nickname;
    var phone = e.parameter.phone;
    var lineId = e.parameter.lineId;
    var guild = e.parameter.guild;

    var result = createUser(email, name, nickname, phone, lineId, guild);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } else if (action ==='qrSignInGet'){ 
    var gaid = e.parameter.gaid;
    var result = getUserInfoByGAID(gaid);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } else if (action ==='staff_purchaseClass'){ 
    var staff_mail = e.parameter.staff_mail;
    var gaid = e.parameter.gaid;
    var item = e.parameter.item;
    var result = purchaseClass(staff_mail, gaid, item);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } else if (action ==='staff_checkinClass'){ 
    var staff_mail = e.parameter.staff_mail;
    var gaid = e.parameter.gaid;
    var item = e.parameter.item;
    var remark = e.parameter.remark;
    var result = checkinClass(staff_mail, gaid, item, remark);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } 

  var errorResponse = {
    status: 'error',
    message: 'Invalid action'
  };
  return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
}