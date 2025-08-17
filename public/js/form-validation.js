document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('country-form');
    if (!form) return;
    
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    const modalConfirmBtn = modal.querySelector('#confirm-btn');
    const modalCloseBtn   = modal.querySelector('#cancel-confirm');
    
    function validateField(field) {
        const validity = field.validity;
        const errorSpan = document.getElementById(field.name + '-error');
        if (validity.valid) {
            errorSpan.textContent = '';
            field.classList.remove('ring-2', 'ring-red-500');
            return true;
        } else {
            if (validity.valueMissing) {
                errorSpan.textContent = 'Este campo es obligatorio.';
            } else if (validity.patternMismatch) {
                errorSpan.textContent = 'Formato inválido.';
            } else if (validity.rangeOverflow || validity.rangeUnderflow) {
                errorSpan.textContent = 'Valor fuera de rango permitido.';
            } else {
                errorSpan.textContent = 'Campo inválido.';
            }
            field.classList.add('ring-2', 'ring-red-500');
            errorSpan.classList.add('text-red-500');
            return false;
        }
    }
    
    function validateForm() {
        let isValid = true;
        const firstInvalidField = [...form.elements].find(field => {
            if (field.tagName.toLowerCase() === 'input' && !validateField(field)) {
                isValid = false;
                return true;
            }
            return false;
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        
        return isValid;
    }
    
    form.addEventListener('submit', (e) => {        
        e.preventDefault();
       
        if (!validateForm()) {
            return;
        }
       
        const submitter = e.submitter;
        if (submitter && submitter.hasAttribute('data-confirm')) {            
            modal.classList.remove('hidden');
            
            modalConfirmBtn.onclick = () => {
                modal.classList.add('hidden');                
                modalConfirmBtn.onclick = null;               
                form.submit();
            };
        } else {           
            form.submit();
        }
    });
   
    modalCloseBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

});