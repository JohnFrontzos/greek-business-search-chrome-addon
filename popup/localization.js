export const translations = {
  en: {
    noResults: 'No results found.',
    vatNum: 'Vat num',
    placeholder: 'Enter TAX ID, title or business name',
  },
  el: {
    noResults: 'Δεν βρέθηκαν αποτελέσματα.',
    vatNum: 'ΑΦΜ',
    placeholder: 'Εισάγετε ΑΦΜ, τίτλο ή επωνυμία επιχείρησης',
  },
};

export function getUserLanguage() {
  const lang = navigator.language || navigator.userLanguage || 'en';
  if (lang.startsWith('el')) {
    return 'el';
  }
  return 'en';
}
