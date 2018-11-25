chrome.webNavigation.onCommitted.addListener(preventAddingDuplicateHostPage);

function preventAddingDuplicateHostPage(details) {
  chrome.tabs.query({}, function(tabs) {
    var hostName = isChromeExtensionNewTab(details.url)
      ? 'chrome://newtab/'
      : extractHostName(details.url);

    for (let index = 0; index < tabs.length; index++) {
      var existedTab = tabs[index];
      var hasSameHostName = !existedTab.active && includes(existedTab.url, hostName);

      if (hasSameHostName) {
        chrome.tabs.update(existedTab.id, {active: true});
        chrome.tabs.remove(details.tabId);
        return;
      }
    }
  });
}

function isChromeExtensionNewTab(url) {
  return includes(url, 'newtab') && !/^(f|ht)tps?:\/\//i.test(url);
}

function extractHostName(url) {
  return (includes(url, '//') ? url.split('/')[2] : url.split('/')[0]).split(':')[0].split('?')[0];
}

function includes(str, substr) {
  return ~str.indexOf(substr);
}
