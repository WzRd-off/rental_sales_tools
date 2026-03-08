document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    
    // Якщо форми на сторінці немає (наприклад, скрипт завантажився на іншій сторінці) - нічого не робимо
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Зупиняємо відправку форми для перевірки
        
        if (validateForm()) {
            // Якщо все ок - тут буде логіка відправки на твій бекенд (order.controller.js)
            alert('Дані валідні! Готуємо відправку на сервер...');
            
            // Щоб реально відправити форму після перевірки, розкоментуй рядок нижче:
            // form.submit(); 
        } else {
            alert('Будь ласка, перевірте правильність заповнення полів.');
        }
    });
});

// Головна функція перевірки
function validateForm() {
    let isValid = true;

    // 1. Перевірка ПІБ (мінімум 3 символи)
    const name = document.getElementById('user-name');
    if (name.value.trim().length < 3) {
        showError(name, 'name-error');
        isValid = false;
    } else {
        hideError(name, 'name-error');
    }

    // 2. Перевірка телефону (має бути 10 цифр)
    const phone = document.getElementById('user-phone');
    const phoneRegex = /^[0-9]{10}$/; 
    // Видаляємо всі пробіли і дужки перед перевіркою
    const cleanPhone = phone.value.replace(/\D/g, ''); 
    
    if (!phoneRegex.test(cleanPhone)) {
        showError(phone, 'phone-error');
        isValid = false;
    } else {
        hideError(phone, 'phone-error');
    }

    return isValid;
}

// Допоміжні функції для показу/сховання помилок
function showError(input, errorId) {
    input.classList.add('invalid');
    const errorEl = document.getElementById(errorId);
    if(errorEl) errorEl.style.display = 'block';
}

function hideError(input, errorId) {
    input.classList.remove('invalid');
    const errorEl = document.getElementById(errorId);
    if(errorEl) errorEl.style.display = 'none';
}