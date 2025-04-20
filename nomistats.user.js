// ==UserScript==
// @name         Nomi Stats
// @namespace    https://gzo.sh
// @version      0.1.1
// @description  Some Nomi stats
// @author       Ghezzo
// @match        https://beta.nomi.ai/nomis*
// @match        https://beta.nomi.ai/group-chats*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nomi.ai
// @downloadURL  https://github.com/Ghezzo/nomistats/raw/refs/heads/main/nomistats.user.js
// @updateURL    https://github.com/Ghezzo/nomistats/raw/refs/heads/main/nomistats.user.js
// ==/UserScript==

console.log("Nomi Stats loaded.");

function addGlobalStyle(css) {
    if (css === undefined) {
        css = '';
    }
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

addGlobalStyle('#statsButton{background-color:#9610ff;cursor:pointer;color:#fff;border-radius:0px 0px 5px 5px;border:none;z-index:9999;padding:5px;width:50px}#statsButton:hover{background-color:#ac43ff}#statsButton:hover .cogIcon{animation:rotate 2s linear infinite}@keyframes rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}#statsPanel{min-width:300px;min-height:100px;max-width:400px;background:#181a20;border:1px solid #44495a;border-radius:5px;color:white;box-shadow:0 0 20px -7px #9610ff}.statsItem:nth-child(even){background-color:#000000}.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}.statsItem{padding:5px;border:1px solid #44495a}.statsItem:last-child{border-bottom:none}.title{margin-left:20px}');

var statsPanel = document.createElement('div');
statsPanel.style.position = 'fixed';
statsPanel.style.top = '35px'; // 90
statsPanel.style.left = '160px'; // 10
statsPanel.style.display = 'none';
statsPanel.id = 'statsPanel'; 

var statsButton = document.createElement('button');
statsButton.innerHTML = 'Stats';
statsButton.style.position = 'fixed';
statsButton.style.top = '0px';
statsButton.style.left = '160px';
statsButton.id = 'statsButton';

document.body.appendChild(statsPanel);
document.body.appendChild(statsButton);

GM_config.init();

statsButton.addEventListener('click', function() {
    if (statsPanel.style.display === 'none') {
        statsPanel.style.display = 'block';
    } else {
        statsPanel.style.display = 'none';
    }
});

const url = "https://beta.nomi.ai/api/me/daily-usage-counts";


function getJSON(url) {
    return fetch(url)
        .then(response => response.json());
}

//addGlobalStyle(".statsItem:nth-child(even) {background-color: #000000;}");

async function main() {
    const url = "https://beta.nomi.ai/api/me/daily-usage-counts";
    const data = await getJSON(url);
    //const innerObjects = Object.values(data.dailyUsageCounts);
    //const innerObjects = data.dailyUsageCounts.chatUserMessages;
    const usageCounts = data.dailyUsageCounts;
    const keyMap = {
    'chatUserMessages': 'User Messages',
    'chatNomiMessages': 'Nomi Messages',
    'chatUserSpeechMessages': 'User Speech Messages',
    'chatNomiSpeechMessages': 'Nomi Speech Messages',
    'chatTtsRequests': 'TTS Requests',
    'groupChatUserMessages': 'Group User Messages',
    'groupChatNomiMessages': 'Group Nomi Messages',
    'groupChatUserSpeechMessages': 'Group User Speech Messages',
    'groupChatNomiSpeechMessages': 'Group Nomi Speech Messages',
    'groupChatTtsRequests': 'Group TTS Requests',
    'photoSelfieRequests': 'Selfie Requests',
    'artSelfieRequests': 'Art Requests',
    'groupChatArtSelfieRequests': 'Group Art Requests',
    'groupChatPhotoSelfieRequests': 'Group Selfie Requests',
    'videoRequestUsages': 'Video Requests',
    'date': 'Date',
    'totalSelfieRequests': 'Total Selfie Requests',
    // add more mappings as needed
    };

    /* const output = `
    ${Object.keys(usageCounts).map(key => `
        <div style="margin-bottom: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>${keyMap[key] || key}</div>
            <div>${usageCounts[key]}</div>
        </div>
        </div>
    `).join('')}
    `; */
    const output = `
    ${Object.keys(usageCounts).map(key => {
        if (keyMap[key]) {
        let value = usageCounts[key];
        if (typeof value === 'string' && value.includes('T')) {
            value = value.split('T')[0];
        }
        return `
            <div class="statsItem">
                <div class="stats">
                    <div>${keyMap[key]}</div>
                    <div>${value}</div>
                </div>
            </div>
        `;
        } else {
        return '';
        }
    }).join('')}
    `;
    statsPanel.innerHTML = `
    <h2 class='title'>WIP - PRobably broken</h2>
    <h3 class='title'>Today - ${usageCounts.date.split('T')[0]}</h3>
    ${output}
    <h3 class="title">Total (Since Install)</h3>
    <div class="statsItem">
        <div class="stats">
            <div>User Messages</div>
            <div>${GM_getValue('totalChatUserMessages')}</div>
        </div>
    </div>
    <div class="statsItem">
        <div class="stats">
            <div>Selfie Requests</div>
            <div>${GM_getValue('totalSelfieRequests')}</div>
        </div>
    </div>
    <div class="statsItem">
        <div class="stats">
            <div>Video Requests</div>
            <div>${GM_getValue('totalVideoRequestsUsage')}</div>
        </div>
    </div>
    `;
    /* statsPanel.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
        <div>User Messages</div>
        <div>${data.dailyUsageCounts.chatUserMessages}</div>
        <div>Nomi Messages</div>
        <div>${data.dailyUsageCounts.chatNomiMessages}</div>
    </div>
    ${output}
    `; */
    const currentChatValue = GM_getValue('totalChatUserMessages', 0);
    const newChatValue = data.dailyUsageCounts.chatUserMessages;
    if (newChatValue < currentChatValue) {
        // do nothing
    } else {
        GM_setValue('totalChatUserMessages', newChatValue);
    }

    const currentTotalSelfieValue = GM_getValue('totalTotalSelfieRequests', 0);
    const newTotalSelfieValue = data.dailyUsageCounts.totalSelfieRequests;
    if (newTotalSelfieValue < currentTotalSelfieValue) {
        // do nothing
    } else {
        GM_setValue('totalSelfieRequests', newTotalSelfieValue);
    }
    
    const currentVideoRequestsValue = GM_getValue('totalVideoRequestsUsage', 0);
    const newVideoRequestsValue = data.dailyUsageCounts.videoRequestsUsage;
    if (newVideoRequestsValue < currentVideoRequestsValue) {
        // do nothing
    } else {
        GM_setValue('totalVideoRequestsUsage', newVideoRequestsValue);
    }


}
main();
setInterval(main, 10000);
