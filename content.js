chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getSelectedText') {
    var selectedText = window.getSelection().toString().trim();
    sendResponse({ selectedText: selectedText });
  }
});
