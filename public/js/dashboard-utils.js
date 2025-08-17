document.addEventListener('DOMContentLoaded', () => {
  const form           = document.getElementById('search-form');
  const input          = document.getElementById('search-input');
  const rows           = Array.from(document.querySelectorAll('#countries-table-body tr'));
  const tableContainer = document.getElementById('table-container');
  const pagination     = document.getElementById('pagination-container');
  const noResults      = document.getElementById('no-results');

  form.addEventListener('submit', e => e.preventDefault());

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let matchCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(q)) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (q === '') {
      tableContainer.style.display = '';
      pagination.style.display     = '';
      noResults.classList.add('hidden');
      if (window.pagination && typeof window.pagination.reset === 'function') {
        window.pagination.reset();
      }
    } else if (matchCount === 0) {
      tableContainer.style.display = 'none';
      pagination.style.display     = 'none';
      noResults.classList.remove('hidden');
    } else {
      tableContainer.style.display = '';
      pagination.style.display     = 'none';
      noResults.classList.add('hidden');
    }
  });
});
