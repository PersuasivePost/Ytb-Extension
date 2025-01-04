document.addEventListener("visibilitychange", () => {
  const video = document.querySelector("video");

  if (!video) return;

  if (document.hidden) {
    // Pause the video when the tab becomes hidden
    if (!video.paused) video.pause();
  } else {
    // Resume the video when the tab becomes visible
    if (video.paused) video.play();
  }
});

chrome.runtime.onMessage.addListener((message) => {
  const video = document.querySelector("video");

  if (!video) return;

  if (message.action === "pause" && !video.paused) {
    video.pause();
  }

  if (message.action === "resume" && video.paused) {
    video.play();
  }
});