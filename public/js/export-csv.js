document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");
  const exportLink = document.getElementById("export-csv-link");

  if (!input || !exportLink) return;

  const query = input.value.trim();

  if (query) {
    try {
      const url = new URL(exportLink.href, window.location.origin);
      url.searchParams.set("q", query);
      exportLink.href = url.toString();
    } catch (e) {
      console.error("❌ Error al construir el link de exportación CSV:", e);
    }
  }
});
