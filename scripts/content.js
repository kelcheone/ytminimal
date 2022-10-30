let state = "ON";
// get state from storage
chrome.storage.sync.get(["state"], (result) => {
  // check if state is set
  if (result.state) {
    state = result.state;
  } else {
    // if not set, set state to ON
    chrome.storage.sync.set({ state: "ON" }, () => {
      console.log("State is set to ON");
    });
  }
});

const hideThumbnails = () => {
  // hide the thumbnails
  const thumbnails = document.getElementsByTagName("ytd-thumbnail");
  for (thumb of thumbnails) {
    thumb.style.display = "none";
  }
};

let intervalId = null;

// only run if the extension is ON
if (state === "ON") {
  //  hide the thumbnails on page load and when new videos are loaded

  window.onload = hideThumbnails;
  intervalId = setInterval(hideThumbnails, 1000);
}

// Receive next state from background script via port
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((nextState) => {
    // Check if the extension is 'ON' or 'OFF'
    state = nextState;
    // If the extension is 'ON', we run the script
    if (state === "ON") {
      intervalId = setInterval(hideThumbnails, 1000);
    } else {
      clearInterval(intervalId);
      // If the extension is 'OFF', restore the thumbnails
      const thumbDiv = document.getElementsByTagName("ytd-thumbnail");
      for (thumb of thumbDiv) {
        thumb.style.display = "block";
      }
    }
  });
});
