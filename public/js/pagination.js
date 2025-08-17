document.addEventListener('DOMContentLoaded', () => {
  const rows    = Array.from(document.querySelectorAll('#countries-table-body tr'));
  const perPage = 5;
  let current   = 1;
  const total   = Math.ceil(rows.length / perPage);

  const firstBtn = document.getElementById('first-page');
  const prevBtn  = document.getElementById('prev-page');
  const nextBtn  = document.getElementById('next-page');
  const lastBtn  = document.getElementById('last-page');
  const info     = document.getElementById('page-info');

  function render() {
    const start = (current - 1) * perPage;
    const end   = start + perPage;
    rows.forEach((r, i) => {
      r.style.display = (i >= start && i < end) ? '' : 'none';
    });
    info.textContent = `Página ${current} de ${total}`;
    firstBtn.disabled = current === 1;
    prevBtn.disabled  = current === 1;
    nextBtn.disabled  = current === total;
    lastBtn.disabled  = current === total;
  }

  firstBtn.addEventListener('click', () => { current = 1; render(); });
  prevBtn.addEventListener('click', () => { if (current > 1) current--; render(); });
  nextBtn.addEventListener('click', () => { if (current < total) current++; render(); });
  lastBtn.addEventListener('click', () => { current = total; render(); });

  window.pagination = {
    reset: () => {
      current = 1;
      render();
    }
  };

  render();
});
