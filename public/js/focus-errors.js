document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('country-form');
  if (!form) return;

  const first = form.querySelector('.border-red-600');
  if (first) first.focus();
});