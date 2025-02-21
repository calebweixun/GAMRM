
// Google Apps Script URL
var url =
    "https://script.google.com/macros/s/AKfycbxjXUF-tnhQHyvJJx4RPEBiymE6SlnZPx6EMDqVnrzUdYi62ROwa46betw0P66ICbT2vA/exec";

async function qrSignIn(gaid) {
    const signbtn = document.getElementById("action-buttons");
    signbtn.style.display = "none";

    console.log(gaid);

    document.getElementById("loading").style.display = "block";
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
        document.getElementById("loading").style.display = "none";

        let container = document.getElementById("query-result");
        container.innerHTML = `
                <p>${data.Name || ""}</p>
                <p>${data.NickName || ""}</p>
                <p>${data.Role || ""}@${data.Guild || ""}</p>
                <p>本季度簽到次數:${data.signInCount || "0"}</p>
            `;
        signbtn.style.display = "block";

        return data;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("loading").style.display = "none";
        alert("連線時發生錯誤，請稍後再試！");
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
        container.innerHTML = "找不到相關資料<br>請洽GA招待組人員";
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
        container.innerHTML = "找不到相關資料<br>請洽GA招待組人員";
        return;
    }

    container.innerHTML = `
      <div class="data-container" style="display: flex">
        <h3>歡迎回到GA</h3>
        <h3>請以此QRCode進行報到</h3>
        <div class="qr-area">
          <img src='https://quickchart.io/qr?size=250x250&text=${data.GAID}' alt="gaid-qrcode">
        </div>
        <h2>${data.Name || ""}  ${data.NickName || ""}</h2>
        <p>${data.Role || ""}@${data.Guild || ""}</p>
        <p>本季度報到次數:${data.signInCount || "0"}</p>
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

    const taiwanMobileRegex = /^09[1-9]\d{7}$/;

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

    const taiwanMobileRegex = /^09[1-9]\d{7}$/;

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
            alert("使用者資料新增成功！");

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
                return;
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
        } else {
            alert("新增失敗：" + result.Message);
            createUserBtn.disabled = false;
        }
    } catch (error) {
        console.error("請求失敗", error);
        alert("發生錯誤，請稍後再試。");
    }

}
