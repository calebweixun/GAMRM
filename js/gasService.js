// Google Apps Script URL
var url =
    "https://script.google.com/macros/s/AKfycbxjXUF-tnhQHyvJJx4RPEBiymE6SlnZPx6EMDqVnrzUdYi62ROwa46betw0P66ICbT2vA/exec";

const taiwanMobileRegex = /^09[0-9]\d{7}$/;

async function qrSignIn(gaid) {
    const signbtn = document.getElementById("action-buttons");
    if (signbtn) signbtn.style.display = "none";

    console.log(gaid);

    const loadingElement = document.getElementById("loading");
    if (loadingElement) loadingElement.style.display = "block";
    document.body.style.cursor = "wait";

    var params = new URLSearchParams({
        action: "qrSignInGet",
        gaid: gaid,
    });

    try {
        let response = await fetch(url + "?" + params.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
            },
        });
        let data = await response.json();

        document.body.style.cursor = "default";
        if (loadingElement) loadingElement.style.display = "none";
        if (signbtn) signbtn.style.display = "block";

        return data;
    } catch (error) {
        console.error("Error:", error);
        if (loadingElement) loadingElement.style.display = "none";
        showErrorNotification("連線時發生錯誤，請稍後再試！");
        return null;
    }
}



/**
 * Searches for user data by email from the server.
 * Retrieves user information and displays it in the data container.
 * Shows a loading indicator while the request is in progress.
 * Alerts the user if no email is entered.
 *  userProfileEdit.html
 */
function searchUserData(event) {
    var email = document.getElementById("email").value;
    const confirmButtonbtn = document.getElementById("confirmButton");
    console.log(email);
    console.log(event);

    if (!email.match(/^\w+@\w+\.\w+$/i)) {
        alert('請輸入有效的 Email')
        return;
    }
    confirmButtonbtn.disabled = true;


    document.getElementById("dataContainer").style.display = "none";

    if (event === "qrshow") {
        confirmButtonbtn.value = "正在查詢資料並產生QR Code...";
    } else if (event === "edit") {
        confirmButtonbtn.value = "正在查詢資料...";
    }

    // document.getElementById("loading").style.display = "flex";
    document.body.style.cursor = "wait";


    var params = new URLSearchParams({
        action: "getUserInfo",
        email: email,
    });

    fetch(url + "?" + params.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "text/plain",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);

            confirmButtonbtn.value = "確認";
            confirmButtonbtn.disabled = false;

            document.body.style.cursor = "default";
            if (event === "edit") {

                displayData(data);
                // document.getElementById("loading").style.display = "none";
            } else if (event === "qrshow") {
                qrShow(data);
                // document.getElementById("loading").style.display = "none";

            }
        })
        .catch((error) => {
            console.error("Error:", error)
            // document.getElementById("loading").style.display = "none";
            alert("連線時發生錯誤，請稍後再試！");
        }

        );
}

function displayData(data) {
    var container = document.getElementById("dataContainer");
    container.innerHTML = "";
    document.getElementById("loading").style.display = "none";

    if (data.Status === "Not Found") {
        container.style.display = "flex";
        container.innerHTML = `
          <div class="data-container" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <i class="material-icons" style="font-size: 48px; color: #DC4E33; margin: 20px 0;">error_outline</i>
            <h2 style="margin-bottom: 10px; font-size: 22px;">找不到相關資料</h2>
            <p style="margin-bottom: 20px;">請洽GA招待組人員</p>
          </div>
        `;
        return;
    }

    container.innerHTML = `
          <div class="data-container" style="display: flex">
            <h3>請確認以下資料，並於修改後確認更新</h3>
            <div class="input-area">
              <label for="gaid">GAID</label>
              <input type="text" id="gaid" value="${data.GAID || ""
        }" disabled />
            </div>
            <div class="input-area">
              <label for="name">姓名</label>
              <input type="text" id="name" value="${data.Name || ""}" />
            </div>
            <div class="input-area">
              <label for="nickname">暱稱/英文名</label>
              <input type="text" id="nickname" value="${data.NickName || ""}" />
            </div>
            <div class="input-area">
              <label for="phone">手機</label>
              <input type="text" id="phone" value="${data.Phone || ""}" />
            </div>
            <div class="input-area">
              <label for="lineId">LINE ID</label>
              <input type="text" id="lineId" value="${data.LINEID || ""}" />
            </div>
            <div class="input-area">
              <label for="guild">所在公會</label>
              <select id="guild">
                <option value="">尚未加入</option>
                <option value="陌開公會">陌開</option>
                <option value="文案公會">文案</option>
                <option value="攝影公會">攝影</option>
                <option value="影音公會">影音</option>
                <option value="音樂公會">音樂</option>
                <option value="設計公會">設計</option>
                <option value="營運組">營運組</option>
              </select>
            </div>
            <div class="input-area">
              <label for="role">身分別</label>
              <input type="text" id="role" value="${data.Role || ""
        }" disabled />
            </div>
            <div class="input-area">
              <label for="level">GA等級</label>
              <input type="text" id="level" value="${data.Level || ""
        }" disabled />
            </div>
            <h3>如要修改Email，請洽GA工作人員</h3>
            <input id="updateUser" type="button" value="確認更新" onclick="updateUserData()" />
          </div>
        `;

    container.style.display = "block";

    // 設定下拉選單的預設值
    const guildSelect = document.getElementById("guild");
    if (data.Guild) {
        guildSelect.value = data.Guild;
    }
}

function qrShow(data) {
    var container = document.getElementById("dataContainer");
    container.innerHTML = "";
    document.getElementById("loading").style.display = "none";
    if (data.Status === "Not Found") {
        container.style.display = "flex";
        container.innerHTML = `
          <div class="data-container" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <i class="material-icons" style="font-size: 48px; color: #DC4E33; margin: 20px 0;">error_outline</i>
            <h2 style="margin-bottom: 10px; font-size: 22px;">找不到相關資料</h2>
            <p style="margin-bottom: 20px;">請洽GA招待組人員</p>
          </div>
        `;
        return;
    }

    container.innerHTML = `
      <div class="data-container" style="display: flex; gap: 0px;">
        <h2 style="color: #DC4E33; font-weight: bold; text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000; font-size: 32px; margin-top: 5px; margin-bottom: 0px;">${data.GAID}</h2>
        <h2 style="margin-top: 0; margin-bottom: 5px;">${data.Name || ""}<br\>${data.NickName || ""}</h2>
        <div class="qr-area" style="margin-bottom: 0;">
          <img src='https://quickchart.io/qr?size=250x250&text=${data.GAID}' alt="gaid-qrcode">
        </div>
        <p style="margin: 2px 0;">${data.Role || ""}@${data.Guild || ""}</p>
        <div style="margin-top: 10px; width: 100%;">
          <h3 style="margin-bottom: 5px;">本季可上課次數</h3>
          <table style="width: 100%; table-layout: fixed; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd; font-size: 14px;">
            <tr>
              <td style="padding: 6px; text-align: right; border: 1px solid #ddd; width: 50%; background-color: #FFE2E2;">剩餘課程數量：</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd;">${data.purchaseRemaining || 0}</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: right; border: 1px solid #ddd; background-color: #FFE2E2;">上次購買日期：</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd;">${data.purchaseDate || "無購買紀錄"}</td>
            </tr>
          </table>
        </div>
        <div style="margin-top: 10px; width: 100%;">
          <h3 style="margin-bottom: 5px;">本季 GA Action 認列紀錄</h3>
          <table style="width: 100%; table-layout: fixed; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd; font-size: 14px;">
            <colgroup>
              <col style="width: 23%;">
              <col style="width: 12%;">
              <col style="width: 65%;">
            </colgroup>
            <tr style="background-color: #FFE2E2;">
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd;">認列項目</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd;">次數</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd;">說明</th>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Give</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Give || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">捐贈給非營利組織 1+</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Care</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Care || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">與GA成員深度談話 2+</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Empower</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Empower || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">邀約GA Day/Line 3+</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Do</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Do || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">完成工會/專案/公開任務 4+</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Love</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Love || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">探班、關懷、服務 5+</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Grow</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Grow || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">出席次數 6+</td>
            </tr>
            <tr>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">Share</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; white-space: nowrap;">${data.Share || 0}</td>
              <td style="padding: 6px; text-align: left; border: 1px solid #ddd; white-space: nowrap; overflow: visible;">分享筆記、貼文、限動 7+</td>
            </tr>
          </table>
          <p style="margin-top: 5px; font-size: 12px; color: #666; font-style: italic;">※ Action 次數為人工認列<br\>若尚未更新，敬請等候人員處理</p>
        </div>
      </div>
        `;

    container.style.display = "block";
}


/**
 *  Search user data by email and update user data to GAS.
 *  userProfileEdit.html
 *  @return {void}
 */
function updateUserData() {
    var email = document.getElementById("email").value;
    //var gaid = document.getElementById("gaid").value;
    var name = document.getElementById("name").value;
    var nickname = document.getElementById("nickname").value;
    var phone = document.getElementById("phone").value;
    var lineId = document.getElementById("lineId").value;
    var guild = document.getElementById("guild").value;

    const updateUserbtn = document.getElementById("updateUser");
    updateUserbtn.disabled = true;

    if (!taiwanMobileRegex.test(phone)) {
        alert("請輸入正確的手機號碼！");
        return;
    }

    // 檢查必填欄位
    if (!name || !nickname || !phone || !lineId) {
        alert("請完成所有欄位！");
        return;
    }

    var params = new URLSearchParams({
        action: "updateUserInfo",
        email: email,
        name: name,
        nickname: nickname,
        phone: phone,
        lineId: lineId,
        guild: guild,
    });
    console.log(params.toString());

    fetch(url + "?" + params.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "text/plain",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            updateUserbtn.disabled = false;
            console.log("Success:", data.Status);
            if (data.Status === "OK") {
                alert("資料已更新！");
                window.location.reload();
            } else {
                alert("更新失敗，請稍後再試！");
            }
        })
        .catch((error) => {
            updateUserbtn.disabled = false;
            console.error("Error:", error);
            alert("發生錯誤，請稍後再試！");
        });


}

/**
 * Checks if the email address is already registered in the GAS database.
 * If not, shows a form to fill in the user's information and creates a new user in the GAS database.
 * If the email address is already registered, shows an error message.
 * @return {void}
 */
async function isEmailDuplicate() {
    const email = document.getElementById("email").value.trim();
    const loading = document.getElementById("loading");
    const dataContainer = document.getElementById("dataContainer");
    const confirmButtonbtn = document.getElementById("confirmButton");

    if (!email.match(/^\w+@\w+\.\w+$/i)) {
        alert('請輸入有效的 Email')
        return;
    }

    // 顯示加載提示
    // loading.style.display = "flex";
    dataContainer.style.display = "none";
    confirmButtonbtn.disabled = true;
    confirmButtonbtn.value = "正在查詢資料...";

    try {
        // 發送請求到 Apps Script
        const response = await fetch(
            `${url}?action=getUserInfo&email=${encodeURIComponent(email)}`
        );
        const result = await response.json();
        console.log(result);

        if (result.Status === "Not Found") {
            // 顯示表單
            dataContainer.style.display = "block";
            dataContainer.innerHTML = `<div class="data-container" style="display: flex">
                <h3>請填寫以下個人資料</h3>
                <div class="input-area">
                    <label for="name">姓名</label>
                    <input type="text" id="name" />
                </div>
                <div class="input-area">
                    <label for="nickname">暱稱/英文名</label>
                    <input type="text" id="nickname" />
                </div>
                <div class="input-area">
                    <label for="phone">手機</label>
                    <input type="text" id="phone" />
                </div>
                <div class="input-area">
                    <label for="lineId">LINE ID</label>
                    <input type="text" id="lineId" />
                </div>
                <div class="input-area">
                    <label for="guild">欲加入公會</label>
                    <select id="guild">
                    <option value="">請選擇/尚未決定</option>
                    <option value="陌開公會">陌開</option>
                    <option value="文案公會">文案</option>
                    <option value="攝影公會">攝影</option>
                    <option value="影音公會">影音</option>
                    <option value="音樂公會">音樂</option>
                    <option value="設計公會">設計</option>
                    </select>
                </div>
                    <input id="createUser" type="button" value="加入GA" onclick="createUserData()" />
                </div>`;
            document.getElementById("email").disabled = true;
        } else {
            alert("此 Email 已經存在，無法重複建立使用者。");
        }
    } catch (error) {
        console.error("請求失敗", error);
        alert("發生錯誤，請稍後再試。");
    } finally {
        // loading.style.display = "none";
        confirmButtonbtn.disabled = false;
        confirmButtonbtn.value = "確認";
    }

}

/**
 *  Search user data by email from the server.
 *  Retrieves user information and displays it in the data container.
 *  Shows a loading indicator while the request is in progress.
 *  Alerts the user if no email is entered.
 *  userCreate.html
 */
async function createUserData() {
    const data = {};
    const emailElem = document.getElementById("email");
    const nameElem = document.getElementById("name");
    const nicknameElem = document.getElementById("nickname");
    const phoneElem = document.getElementById("phone");
    const lineIdElem = document.getElementById("lineId");
    const guildElem = document.getElementById("guild");
    const createUserBtn = document.getElementById("createUser");

    const email = emailElem.value.trim();
    const name = nameElem.value.trim();
    const nickname = nicknameElem.value.trim();
    const phone = phoneElem.value.trim();
    const lineId = lineIdElem.value.trim();
    const guild = guildElem.value;

    if (!taiwanMobileRegex.test(phone)) {
        alert("請輸入正確的手機號碼！");
        return;
    }

    if (!email || !name || !nickname || !phone || !lineId) {
        alert("請填寫完整的資料！");
        return;
    }

    createUserBtn.disabled = true;

    console.log(`${url}?action=createUser&email=${encodeURIComponent(
        email
    )}&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(
        nickname
    )}&phone=${encodeURIComponent(phone)}&lineId=${encodeURIComponent(
        lineId
    )}&guild=${encodeURIComponent(guild)}`);

    try {
        // 發送請求到 Apps Script
        const response = await fetch(
            `${url}?action=createUser&email=${encodeURIComponent(
                email
            )}&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(
                nickname
            )}&phone=${encodeURIComponent(phone)}&lineId=${encodeURIComponent(
                lineId
            )}&guild=${encodeURIComponent(guild)}`,
            {
                method: "GET",
            }
        );
        const result = await response.json();
        console.log(result);
        if (result.Status === "Success") {
            // alert("使用者資料新增成功！");

            emailElem.disabled = true;
            nameElem.disabled = true;
            nicknameElem.disabled = true;
            phoneElem.disabled = true;
            lineIdElem.disabled = true;
            guildElem.disabled = true;

            createUserBtn.value = "已註冊完成";

            // searchUserData("qrshow");

            if (result.GAID === undefined) {
                alert("GAID 未取得，無法產生QR Code，請洽GA招待組人員");
                createUserBtn.disabled = false;
                return { success: false };
            }
            data.GAID = result.GAID;
            data.Name = name;
            data.NickName = nickname;
            data.Role = "訪客";
            data.Guild = guild;
            data.signInCount = 0;

            qrShow(data);

            document.getElementById("confirmButton").disabled = false;
            document.getElementById("email").disabled = false;

            return { success: true, data: data };
        } else {
            alert("新增失敗：" + result.Message);
            createUserBtn.disabled = false;
            return { success: false };
        }
    } catch (error) {
        console.error("請求失敗", error);
        alert("發生錯誤，請稍後再試。");
        return { success: false };
    }
}

async function purchaseClass(staff_mail, gaid, item) {
    try {
        var params = new URLSearchParams({
            action: "staff_purchaseClass",
            staff_mail: staff_mail,
            gaid: gaid,
            item: item
        });

        const response = await fetch(url + "?" + params.toString(), {
            method: "GET",
        });

        // 檢查響應狀態
        if (!response.ok) {
            throw new Error(`伺服器回應狀態: ${response.status}`);
        }

        // 檢查響應內容是否為空
        const text = await response.text();
        if (!text || text.trim() === '') {
            console.error("伺服器回應為空");
            return { success: false, error: "伺服器回應為空" };
        }

        // 解析JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (jsonError) {
            console.error("JSON解析錯誤:", jsonError, "原始回應:", text);
            return { success: false, error: "JSON解析錯誤", rawResponse: text };
        }

        console.log(result);

        if (result.Status === "Success") {
            return { success: true, data: result };
        } else {
            alert("購買失敗：" + (result.Message || "未知錯誤"));
            return { success: false, message: result.Message };
        }
    } catch (error) {
        console.error("請求失敗", error);
        alert("發生錯誤，請稍後再試。");
        return { success: false, error: error.message };
    }
}

async function checkinClass(staff_mail, gaid, item, remark) {
    try {
        var params = new URLSearchParams({
            action: "staff_checkinClass",
            staff_mail: staff_mail,
            gaid: gaid,
            item: item,
            remark: remark
        });

        const response = await fetch(url + "?" + params.toString(), {
            method: "GET",
        });

        // 檢查響應狀態
        if (!response.ok) {
            throw new Error(`伺服器回應狀態: ${response.status}`);
        }

        // 檢查響應內容是否為空
        const text = await response.text();
        if (!text || text.trim() === '') {
            console.error("伺服器回應為空");
            return { success: false, error: "伺服器回應為空" };
        }

        // 解析JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (jsonError) {
            console.error("JSON解析錯誤:", jsonError, "原始回應:", text);
            return { success: false, error: "JSON解析錯誤", rawResponse: text };
        }

        console.log(result);

        if (result.Status === "Success") {
            return { success: true, data: result };
        } else {
            alert("簽到失敗：" + (result.Message || "未知錯誤"));
            return { success: false, message: result.Message };
        }
    } catch (error) {
        console.error("請求失敗", error);
        alert("發生錯誤，請稍後再試。");
        return { success: false, error: error.message };
    }
}
