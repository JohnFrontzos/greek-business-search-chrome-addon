export default async function fetchBusinessData(searchTerm) {
  const response = await fetch(
    `https://publicity.businessportal.gr/api/autocomplete/${searchTerm}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: null, language: 'el' }),
    }
  );
  const data = await response.json();

  // Process items: fill title and create new objects to avoid param reassignment
  const processedItems = data.payload.autocomplete.map((item) => {
    const newItem = { ...item }; // Create a shallow copy
    if (!newItem.title) {
      newItem.title = newItem.co_name;
    }
    return newItem;
  });

  // Sort results with active status first
  const activeStatus = 'Ενεργή';
  processedItems.sort((a, b) => {
    if (a.companyStatus === activeStatus && b.companyStatus !== activeStatus) {
      return -1;
    }
    if (a.companyStatus !== activeStatus && b.companyStatus === activeStatus) {
      return 1;
    }
    return 0;
  });
  return processedItems;
}
