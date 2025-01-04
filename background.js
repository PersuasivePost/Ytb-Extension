chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser is not focused (user switched to another app)
    chrome.tabs.query({ url: "https://www.youtube.com/*" }, (youtubeTabs) => {
      youtubeTabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: "pause" });
      });
    });
  } else {
    // Browser is focused
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url.includes("youtube.com/watch")) {
        chrome.tabs.sendMessage(activeTab.id, { action: "resume" });
      } else {
        chrome.tabs.query({ url: "https://www.youtube.com/*" }, (youtubeTabs) => {
          youtubeTabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { action: "pause" });
          });
        });
      }
    });
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (activeTab && activeTab.url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(activeTab.id, { action: "resume" });
  } else {
    chrome.tabs.query({ url: "https://www.youtube.com/*" }, (youtubeTabs) => {
      youtubeTabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: "pause" });
      });
    });
  }
});
