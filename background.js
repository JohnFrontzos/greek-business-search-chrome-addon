import fetchBusinessData from './utils/apiHandler';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchBusiness') {
    fetchBusinessData(request.searchTerm)
      .then((results) => {
        sendResponse({ results });
      })
      .catch((error) => {
        sendResponse({ error: error.toString() });
      });
    return true; // Keep the message channel open for async response
  }
  return undefined; // Explicitly return undefined if the action is not "searchBusiness"
});
