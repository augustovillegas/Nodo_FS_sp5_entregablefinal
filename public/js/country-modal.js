document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('country-modal');
  const closeModalBtn = document.getElementById('close-modal');

  function showCountryModal(row) {
    document.getElementById('modal-name').textContent       = row.dataset.name || '-';
    document.getElementById('modal-capital').textContent    = row.dataset.capital || '-';
    document.getElementById('modal-area').textContent       = row.dataset.area || '-';
    document.getElementById('modal-population').textContent = row.dataset.population || '-';
    document.getElementById('modal-timezones').textContent  = row.dataset.timezones || '-';
    document.getElementById('modal-gini').textContent       = row.dataset.gini || '-';
    document.getElementById('modal-creator').textContent    = row.dataset.creator || '-';

    // bandera
    const flagUrl = row.dataset.flag;
    const flagEl = document.getElementById('modal-flag');
    if (flagUrl && flagUrl.startsWith('http')) {
      flagEl.src = flagUrl;
      flagEl.classList.remove('hidden');
    } else {
      flagEl.src = '';
      flagEl.classList.add('hidden');
    }

    // bordes
    try {
      const borders = JSON.parse(row.dataset.borders || '[]');
      document.getElementById('modal-borders').textContent = borders.length ? borders.join(', ') : '-';
    } catch {
      document.getElementById('modal-borders').textContent = '-';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  window.showCountryModal = showCountryModal;

  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
});
