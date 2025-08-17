document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('confirm-modal');
  if (!modal) return;

  const close = () => modal.classList.add('hidden');
  modal.querySelector('#cancel-confirm').addEventListener('click', close);
  modal.addEventListener('click', e => {
    if (e.target === modal) close();
  });

  window.openConfirmModal = () => modal.classList.remove('hidden');
  window.closeConfirmModal = close;
});
