import { translations, getUserLanguage } from './localization';

const activeStatus = 'Ενεργή'; // Define active status globally

function displayResults(results, userLang) {
  const resultsContainer = document.getElementById('resultsContainer');
  if (!resultsContainer) {
    return;
  }

  // Clear previous results
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    // Create and append empty state message
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = translations[userLang].noResults;
    resultsContainer.appendChild(emptyState);
  } else {
    // Create and append results list
    const ul = document.createElement('ul');
    ul.className = 'results-list'; // Add class for styling
    results.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.style.display = 'flex'; // Use flexbox layout

      const statusIcon = document.createElement('i');
      statusIcon.className = 'result-status bi';
      if (item.companyStatus === activeStatus) {
        statusIcon.classList.add('bi-check-circle-fill');
        statusIcon.style.color = '#198754'; // Bootstrap success green
      } else {
        statusIcon.classList.add('bi-x-circle-fill');
        statusIcon.style.color = '#dc3545'; // Bootstrap danger red
      }
      statusIcon.style.fontSize = '1.2rem';
      statusIcon.style.alignSelf = 'center'; // Center vertically
      li.appendChild(statusIcon);

      const textContainer = document.createElement('div'); // Create container for title and subtitle
      textContainer.style.display = 'flex';
      textContainer.style.flexDirection = 'column';
      textContainer.style.marginLeft = '8px'; // Adjust margin for spacing

      const title = document.createElement('span');
      title.className = 'result-title';
      title.textContent = item.title;
      textContainer.appendChild(title);

      const subtitle = document.createElement('span');
      subtitle.className = 'result-subtitle';
      subtitle.textContent = `${translations[userLang].vatNum}: ${item.afm}`;
      textContainer.appendChild(subtitle);

      li.appendChild(textContainer);

      li.addEventListener('click', () => {
        window.open(
          `https://publicity.businessportal.gr/company/${item.arGemi}`,
          '_blank'
        );
      });

      ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
  }
}

function searchBusinessPortal(userLang) {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm) {
    chrome.runtime.sendMessage(
      { action: 'searchBusiness', searchTerm },
      (response) => {
        if (response.error) {
          displayResults([], userLang);
        } else {
          displayResults(response.results, userLang);
        }
      }
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const userLang = getUserLanguage();
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = translations[userLang].placeholder;
  }
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchBusinessPortal(userLang);
  });
});
