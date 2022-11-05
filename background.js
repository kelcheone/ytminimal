chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "OFF" });
  //   set the default state to ON
  chrome.storage.sync.set({ state: "OFF" }, () => {
    console.log("State is set to OFF");
  });
});

yt = "https://www.youtube.com";

chrome.action.onClicked.addListener(async (tab) => {
  console.log(tab.url);
  if (tab.url.startsWith("https://www.youtube.com")) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
    chrome.storage.sync.set({ state: nextState }, () => {
      console.log("State is set to " + nextState);
    });

    const port = chrome.tabs.connect(tab.id);
    port.postMessage(nextState);
  }
});
