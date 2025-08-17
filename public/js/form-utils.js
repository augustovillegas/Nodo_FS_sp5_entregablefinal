document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('country-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input:not([type="hidden"])');
  inputs.forEach(input => {
    ['input', 'blur'].forEach(evt =>
      input.addEventListener(evt, () => validateField(input))
    );
  });

  const emojiRegex = /[\p{Extended_Pictographic}\u200D\uFE0F]/u;
  const letterRegex = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;
  const numberRegex = /\d/;

  function validateField(input) {
    const nameSelector = input.name?.replace(/\./g, '\\.');
    const errorEl = document.getElementById(`${nameSelector}-error`) || document.getElementById(`${input.id}-error`);
    if (!errorEl || !input) return;

    let msg = '';
    const val = input.value.trim();
    const nm = input.name;
    const required = input.required;
    const pattern = new RegExp(input.pattern);

    if (required && !val) {
      msg = 'Este campo es obligatorio.';
    }

    if (!msg && val) {
      if (input.type === 'text') {
        if (input.minLength > 0 && val.length < input.minLength) {
          msg = `Debe tener al menos ${input.minLength} caracteres.`;
        } else if (input.maxLength >= 0 && val.length > input.maxLength) {
          msg = `No puede superar ${input.maxLength} caracteres.`;
        }
      }

      if (input.type === 'url' && !pattern.test(val)) {
        msg = 'Debe ser una URL válida (.svg o .png).';
      }

      if (!msg && input.pattern && !pattern.test(val)) {
        msg = input.title;
      }

      if (!msg) {
        if (['name.official', 'capital', 'creador'].includes(nm)) {
          if (numberRegex.test(val)) {
            msg = 'No se permiten números en este campo.';
          } else if (emojiRegex.test(val)) {
            msg = 'No se permiten emoticones.';
          }
        } else if (['area', 'population', 'gini'].includes(nm)) {
          if (letterRegex.test(val)) {
            msg = 'No se permiten letras en este campo.';
          } else if (emojiRegex.test(val)) {
            msg = 'No se permiten emoticones.';
          }
        } else if (nm === 'borders') {
          const codes = val.split(',').map(s => s.trim());
          const invalid = codes.filter(c => !/^[A-Z]{3}$/.test(c));
          if (invalid.length > 0) {
            msg = 'Cada border debe ser un código CCA3 (3 letras mayúsculas).';
          }
        } else if (nm === 'timezones' && !/^UTC[+-][0-1][0-9]:[0-5][0-9]$/.test(val)) {
          msg = 'timezones debe tener el formato UTC±HH:MM (ej: UTC-03:00)';
        }
      }
    }

    if (msg) {
      errorEl.textContent = msg;
      input.classList.add('border-red-600', 'ring-2', 'ring-red-500', 'focus:ring-red-500');
      input.classList.remove('focus:ring-yellow-500');
    } else {
      errorEl.textContent = '';
      input.classList.remove('border-red-600', 'ring-2', 'ring-red-500', 'focus:ring-red-500');
      input.classList.add('focus:ring-yellow-500');
    }
  }

  const flagUrl = document.getElementById('flagUrl');
  const hiddenSvg = document.getElementById('flagsSvg');
  const hiddenPng = document.getElementById('flagsPng');

  function syncFlagHiddenFields() {
    if (!flagUrl || !hiddenSvg || !hiddenPng) return;
    const url = (flagUrl.value || '').trim();

    hiddenSvg.value = '';
    hiddenPng.value = '';

    if (!url) return;

    const lower = url.toLowerCase();
    if (lower.endsWith('.svg')) {
      hiddenSvg.value = url;
    } else if (lower.endsWith('.png')) {
      hiddenPng.value = url;
    }
  }

  if (flagUrl) {
    flagUrl.addEventListener('input', syncFlagHiddenFields);
    flagUrl.addEventListener('blur', syncFlagHiddenFields);
    syncFlagHiddenFields();
  }
});