chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "searchBusiness") {
    fetch(`https://publicity.businessportal.gr/api/autocomplete/${request.searchTerm}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: null, language: "el" })
    })
    .then(response => response.json())
    .then(data => {
      // Fill title with co_name if title is empty
      data.payload.autocomplete.forEach(item => {
        if (!item.title) {
          item.title = item.co_name;
        }
      });
      // Sort results with active status first
      const activeStatus = "Ενεργή";
      data.payload.autocomplete.sort((a, b) => {
        if (a.companyStatus === activeStatus && b.companyStatus !== activeStatus) {
          return -1;
        } else if (a.companyStatus !== activeStatus && b.companyStatus === activeStatus) {
          return 1;
        } else {
          return 0;
        }
      });
      sendResponse({ results: data.payload.autocomplete });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ error: error.toString() });
    });
    return true; // Keep the message channel open for async response
  }
});