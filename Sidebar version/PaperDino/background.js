chrome.action.onClicked.addListener(() => {
    console.log("icon clicked!")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {sidebarStat: "on"}, function(response) {
            console.log(response);
        });
      });
});