// ==UserScript==
// @name         Nomi Stats
// @namespace    https://gzo.sh
// @version      0.1
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

addGlobalStyle('#statsButton{background-color:#9610ff;cursor:pointer;color:#fff;border-radius:0px 0px 5px 5px;border:none;z-index:9999;padding:5px;width:50px}#statsButton:hover{background-color:#ac43ff}#statsButton:hover .cogIcon{animation:rotate 2s linear infinite}#saveSettingsButton,#settingsButton{background-color:#9610ff;transition:background-color .2s ease-out;padding:10px;cursor:pointer;color:#fff}#settingsButton{border-radius:5px;border:none;z-index:9999}#saveSettingsButton:hover,#settingsButton:hover{background-color:#a12aff !important}#settingsButton:hover .cogIcon{animation:rotate 2s linear infinite}@keyframes rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}#statsPanel{min-width:300px;min-height:100px;max-width:400px;background:#181a20;border:1px solid #44495a;border-radius:5px;color:white;padding:10px;box-shadow:0 0 20px -7px #9610ff}#saveSettingsButton{border-radius:5px;border:none;margin-top:10px}.textbox{background-color:#2b2f3a;transition:background-color .2s ease-out;color:#fff;border:1px solid black;border-radius:5px;padding:5px;width:100%}.textbox:focus{background-color:#363b49;outline:none;border:1px solid #ccc}.textbox:hover{background-color:#363b49;outline:none;border:1px solid #ccc}.changelogLink{color:#9610ff;text-decoration:none;transition:color .2s ease-out}.changelogLink:hover{color:#a12aff !important}.hr{border:0;height:1px;min-width:300px;background:#333;background-image:linear-gradient(to right, #ccc, #333, #ccc)}.cb{accent-color:#9610ff;width:16px;height:16px;margin-bottom:-3px}.info{font-size:13px}');

var statsPanel = document.createElement('div');
statsPanel.style.position = 'fixed';
statsPanel.style.top = '35px'; // 90
statsPanel.style.left = '160px'; // 10
statsPanel.style.display = 'block';
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

async function main() {
    const url = "https://beta.nomi.ai/api/me/daily-usage-counts";
    const data = await getJSON(url);
    //const innerObjects = Object.values(data.dailyUsageCounts);
    const innerObjects = data.dailyUsageCounts.chatUserMessages;
    const usageCounts = data.dailyUsageCounts;
    const output = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${Object.keys(usageCounts).map(key => `
        <div>${key}</div>
        <div>${usageCounts[key]}</div>
        `).join('')}
    </div>
    `;
    statsPanel.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>User Messages</div>
        <div>${data.dailyUsageCounts.chatUserMessages}</div>
    </div>
    ${output}
    `;
    //statsPanel.innerHTML = `${JSON.stringify(data.dailyUsageCounts)}`;
    //console.log(innerObjects); // Log the inner objects
    //console.log(data); // Log the entire data object
    /* const dailyMessageCount = data.dailyusagecounts.dailymessagecount;
    console.log(dailyMessageCount); */
}

main();
setInterval(main, 10000);
