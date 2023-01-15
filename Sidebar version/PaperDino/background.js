chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {sidebarStat: "on"}, function(response) {
            console.log(response);
        });
      });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting == "seeall"){
        chrome.tabs.create({"url":"see_all/list.html"})
      }
    }
  );