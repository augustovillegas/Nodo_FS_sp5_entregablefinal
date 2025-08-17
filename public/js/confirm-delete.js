document.addEventListener('DOMContentLoaded', () => {
  const modal     = document.getElementById('delete-modal');
  const nameEl    = document.getElementById('delete-name');
  const form      = document.getElementById('delete-form');
  const cancelBtn = document.getElementById('cancel-delete');

  window.confirmDelete = {
    open: (id, name) => {
      nameEl.textContent  = name;
      form.action         = `/api/countries/${id}?_method=DELETE`;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    },
    close: () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  cancelBtn.addEventListener('click', () => window.confirmDelete.close());
  modal.addEventListener('click', e => {
    if (e.target === modal) window.confirmDelete.close();
  });
});
