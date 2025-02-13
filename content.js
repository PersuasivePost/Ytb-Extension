console.log("✅ YouTube Auto Pause/Resume content script loaded!");

function pauseVideo() {
  const video = document.querySelector("video");
  if (video && !video.paused) {
    console.log("⏸️ Pausing video...");
    video.pause();
  }
}

function playVideo() {
  const video = document.querySelector("video");
  if (video && video.paused) {
    console.log("▶️ Resuming video...");
    video.play();
  }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "pause") pauseVideo();
  if (message.action === "resume") playVideo();
});
