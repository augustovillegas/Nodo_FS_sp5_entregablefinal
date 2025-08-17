document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('country-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    if (e.submitter && e.submitter.hasAttribute('data-confirm')) {
      e.preventDefault();
      window.openConfirmModal();
    }
  });

  const btn = document.getElementById('confirm-submit');
  if (btn) {
    btn.addEventListener('click', () => {
      window.closeConfirmModal();
      form.submit();
    });
  }
});
