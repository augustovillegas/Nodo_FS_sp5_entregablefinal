document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll("[data-info-toggle]");

  toggles.forEach((toggle) => {
    const targetId = toggle.getAttribute("data-info-toggle");
    const target = document.getElementById(targetId);
    if (!target) return;

    // Estado inicial: colapsado
    target.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");

    // Íconos a usar (derecha = cerrado, abajo = abierto)
    const icon = toggle.querySelector("i");
    const rightCls = toggle.getAttribute("data-icon-right") || "ph-caret-right";
    const downCls  = toggle.getAttribute("data-icon-down")  || "ph-caret-down";

    // Asegurar icono inicial "derecha" y color amarillo
    if (icon) {
      icon.classList.remove(downCls);
      icon.classList.add(rightCls);
      icon.classList.add("text-yellow-400");
    }

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      const next = !expanded;

      toggle.setAttribute("aria-expanded", String(next));
      target.classList.toggle("hidden");

      if (icon) {
        icon.classList.toggle(rightCls, !next); // cerrado -> derecha
        icon.classList.toggle(downCls, next);   // abierto -> abajo
      }
    });
  });
});

