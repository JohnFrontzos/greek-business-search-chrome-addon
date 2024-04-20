document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchButton').addEventListener('click', searchBusinessPortal);
  document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      searchBusinessPortal();
    }
  });
});

const activeStatus = "Ενεργή"; // Define active status globally

function searchBusinessPortal() {
  var searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm) {
    fetch(`https://publicity.businessportal.gr/api/autocomplete/${searchTerm}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: null, language: "el" }) // Adding language in el, because the en version is missing attribute values!
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
      data.payload.autocomplete.sort((a, b) => {
        if (a.companyStatus === activeStatus && b.companyStatus !== activeStatus) {
          return -1;
        } else if (a.companyStatus !== activeStatus && b.companyStatus === activeStatus) {
          return 1;
        } else {
          return 0;
        }
      });

      // Display results
      displayResults(data.payload.autocomplete);
    })
    .catch(error => console.error('Error:', error));
  }
}

function displayResults(results) {
  var resultsContainer = document.getElementById("resultsContainer");
  if (!resultsContainer) {
    console.error('Results container not found');
    return;
  }

  // Clear previous results
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    // Create and append empty state message
    var emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No results found.';
    resultsContainer.appendChild(emptyState);
  } else {
    // Create and append results list
    var ul = document.createElement('ul');
    ul.className = 'results-list'; // Add class for styling
    results.forEach(item => {
      var li = document.createElement('li');
      li.className = 'result-item';
      li.style.display = 'flex'; // Use flexbox layout

      var statusIcon = document.createElement("span");
      statusIcon.className = "result-status";
      statusIcon.textContent = item.companyStatus === activeStatus ? "✅" : "❌"; // Use activeStatus variable
      statusIcon.style.alignSelf = 'center'; // Center vertically
      li.appendChild(statusIcon);

      var textContainer = document.createElement('div'); // Create container for title and subtitle
      textContainer.style.display = 'flex';
      textContainer.style.flexDirection = 'column';
      textContainer.style.marginLeft = '8px'; // Adjust margin for spacing

      var title = document.createElement("span");
      title.className = "result-title";
      title.textContent = item.title;
      textContainer.appendChild(title);

      var subtitle = document.createElement("span");
      subtitle.className = "result-subtitle";
      subtitle.textContent = `Vat num: ${item.afm}`;
      textContainer.appendChild(subtitle);

      li.appendChild(textContainer);

      li.addEventListener('click', function() {
        window.open(`https://publicity.businessportal.gr/company/${item.arGemi}`, "_blank");
      });

      ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
  }
}



