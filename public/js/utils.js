function formatPrice(price) {  
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0
  }).format(price)
}

//formatPrice(12345) = "12 345 ₴"

const storage = {
set: function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch(e) {
            console.error('Error saving to local storage', e)
 }
},

get: function (key) {
        try {
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : null
        } catch(e) {
            console.error('Error reading from local storage', e)
            return null
        }
},

remove: function (key) {
        localStorage.removeItem(key)
}
}

//storage.set('cart',[]) -> сохранить
//storage.get('cart') -> получить
//storage.remove('cart') -> удалить

function showToast(message, type = 'info') {
    let container = document.querySelector('toast-container')
    if(!container) {
        container = document.createElement('div')
        container.className = 'toast-container'
        document.body.appendChild(container)
    }
    const toast = document.createElement('div')
    toast.className = toast ${type}
    toast.textContent = message
    container.appendChild(toast)
    setTimeout(() => toast.remove(), 3000) //через 3 секунды удаляет тост
}

//showToast('Товар добавлен в корзину', 'success') -> зеленая писька снизу справа 
//showToast('Ошибка при добавлении товара', 'error') -> красная писька снизу справа
//showToast('Информация сохранена', 'info') -> синяя писька снизу справа