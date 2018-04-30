// https://www.coreycleary.me/setting-up-chrome-extensions-for-use-with-es6/

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log('click!');
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "action": "toggle"}, function(response){
            setIcon(response.icon, activeTab);
        });
    });
});

function setIcon(icon, tab){
    chrome.browserAction.setIcon({path: icon, tabId:tab.id}); 
}