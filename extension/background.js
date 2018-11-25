chrome.webNavigation.onCommitted.addListener(preventAddingDuplicateHostPage);

function preventAddingDuplicateHostPage(details) {
  // get common info about the tab because it might be created by another extension
  chrome.tabs.get(details.tabId, function(currentTab) {
    currentTab &&
      chrome.tabs.query({}, function(tabs) {
        var hostName = extractHostName(currentTab.url);

        for (let index = 0; index < tabs.length; index++) {
          var existedTab = tabs[index];
          var hasSameHostName = !existedTab.active && ~existedTab.url.indexOf(hostName);

          if (hasSameHostName) {
            chrome.tabs.update(existedTab.id, {active: true});
            chrome.tabs.remove(currentTab.id);
            return;
          }
        }
      });
  });
}

function extractHostName(url) {
  return (~url.indexOf('//') ? url.split('/')[2] : url.split('/')[0]).split(':')[0].split('?')[0];
}
