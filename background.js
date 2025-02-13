// Send messages to content.js
function sendMessageToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, () => {
    if (chrome.runtime.lastError) {
      console.warn("⚠️ Could not send message:", chrome.runtime.lastError.message);
    }
  });
}

// Inject content script before sending messages
function injectContentScript(tabId, callback) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["content.js"]
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn("⚠️ Could not inject script:", chrome.runtime.lastError.message);
      } else {
        callback(); // Run the callback after successful injection
      }
    }
  );
}

// Function to pause all YouTube videos
function pauseAllYouTubeVideos() {
  chrome.tabs.query({ url: "https://www.youtube.com/*" }, (youtubeTabs) => {
    youtubeTabs.forEach((tab) => {
      injectContentScript(tab.id, () => {
        sendMessageToTab(tab.id, { action: "pause" });
      });
    });
  });
}

// Function to resume YouTube videos on the active tab
function resumeActiveYouTubeVideo() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    if (activeTab && activeTab.url.includes("youtube.com/watch")) {
      injectContentScript(activeTab.id, () => {
        sendMessageToTab(activeTab.id, { action: "resume" });
      });
    } else {
      pauseAllYouTubeVideos();
    }
  });
}

// Handle window focus change
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // User switched to another app, pause videos
    pauseAllYouTubeVideos();
  } else {
    // User returned to browser, resume if needed
    resumeActiveYouTubeVideo();
  }
});

// Handle tab switching
chrome.tabs.onActivated.addListener(() => {
  resumeActiveYouTubeVideo();
});
