/**
 * Koi-Zen Background Service Worker
 */

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'spawnKoi') {
    spawnKoiInActiveTab();
  }
});

// Set initial alarm when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Koi-Zen installed. Setting up alarm...');
  chrome.alarms.create('spawnKoi', { periodInMinutes: 30 });
});

async function spawnKoiInActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'spawn' });
  }
}

// Keep the service worker alive if needed or handle popup messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'spawnNow') {
    spawnKoiInActiveTab();
    sendResponse({ status: 'spawned' });
  } else if (message.action === 'updateAlarm') {
    console.log(`Updating alarm frequency to ${message.frequency} minutes`);
    chrome.alarms.clear('spawnKoi', () => {
      chrome.alarms.create('spawnKoi', { periodInMinutes: message.frequency });
    });
    sendResponse({ status: 'alarmUpdated' });
  }
  return true;
});
