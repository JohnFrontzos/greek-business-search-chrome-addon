const translations = {
  en: {
    noResults: "No results found.",
    vatNum: "Vat num",
    placeholder: "Enter TAX ID, title or business name"
  },
  el: {
    noResults: "Δεν βρέθηκαν αποτελέσματα.",
    vatNum: "ΑΦΜ",
    placeholder: "Εισάγετε ΑΦΜ, τίτλο ή επωνυμία επιχείρησης"
  }
};

const activeStatus = "Ενεργή"; // Define active status globally

function getUserLanguage() {
  const lang = navigator.language || navigator.userLanguage || "en";
  if (lang.startsWith("el")) {
    return "el";
  }
  return "en";
}

document.addEventListener('DOMContentLoaded', function() {
  const userLang = getUserLanguage();
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = translations[userLang].placeholder;
  }
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchBusinessPortal(userLang);
  });
});

function searchBusinessPortal(userLang) {
  var searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm) {
    chrome.runtime.sendMessage(
      { action: "searchBusiness", searchTerm: searchTerm },
      (response) => {
        if (response.error) {
          console.error('Error:', response.error);
          displayResults([], userLang);
        } else {
          displayResults(response.results, userLang);
        }
      }
    );
  }
}

function displayResults(results, userLang) {
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
    emptyState.textContent = translations[userLang].noResults;
    resultsContainer.appendChild(emptyState);
  } else {
    // Create and append results list
    var ul = document.createElement('ul');
    ul.className = 'results-list'; // Add class for styling
    results.forEach(item => {
      var li = document.createElement('li');
      li.className = 'result-item';
      li.style.display = 'flex'; // Use flexbox layout

      var statusIcon = document.createElement("i");
      statusIcon.className = "result-status bi";
      if (item.companyStatus === activeStatus) {
        statusIcon.classList.add("bi-check-circle-fill");
        statusIcon.style.color = "#198754"; // Bootstrap success green
      } else {
        statusIcon.classList.add("bi-x-circle-fill");
        statusIcon.style.color = "#dc3545"; // Bootstrap danger red
      }
      statusIcon.style.fontSize = "1.2rem";
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
      subtitle.textContent = `${translations[userLang].vatNum}: ${item.afm}`;
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