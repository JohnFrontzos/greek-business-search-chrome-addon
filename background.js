chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  var searchTerm = message.selectedText;
  if (searchTerm) {
    fetch(`https://publicity.businessportal.gr/api/autocomplete/${searchTerm}`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ success: false, error: error });
    });
    return true; // Indicates that sendResponse will be called asynchronously
  }
});
