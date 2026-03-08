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
    toast.className = `toast ${type}`
    toast.textContent = message
    container.appendChild(toast)
    setTimeout(() => toast.remove(), 3000) //через 3 секунды удаляет тост
}

//showToast('Товар добавлен в корзину', 'success') -> зеленая писька снизу справа 
//showToast('Ошибка при добавлении товара', 'error') -> красная писька снизу справа
//showToast('Информация сохранена', 'info') -> синяя писька снизу справа

const API_URL = 'http://localhost:3000'

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/api/catalog`)
    if (!res.ok) throw new Error('Error fetching products')
    const products = await res.json()
    return products
  } catch(e) {
    console.error('Ошибка:', e)
    showToast('Error to upload products', 'error')
    return []
  }
}
// fetchProducts() -> возращает масив всех продуктов [{prod_id, name, cost...}, ...]

async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_URL}/api/catalog/${id}`)
    if (!res.ok) throw new Error('Product not found')
    const product = await res.json()
    return product
  } catch(e) {
    console.error('Ошибка:', e)
    showToast('Error fetching product', 'error')
    return null
  }
}
// fetchProductById(5) -> возращает один продукт {prod_id: 5, name, cost...}


function renderProductCard(product) {
  return `
    <div class="card product-card" data-id="${product.prod_id}">
      <div class="product-card__img">
        <div class="product-card__icon">🛠️</div>
        <div style="position: absolute; top: 10px; right: 10px;">
          <span class="badge ${product.status === 'В наявності' ? 'badge-success' : 'badge-gray'}">${product.status}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="product-card__sku">SKU: ${product.prod_id}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <div class="mb-4">
          <div class="product-card__price-label">Продаж</div>
          <div class="product-card__price">${formatPrice(product.cost)}</div>
        </div>
        <div class="mb-4">
          <div class="product-card__price-label">Категорія</div>
          <div class="product-card__rent">${product.category}</div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-dark btn-block" onclick="window.location.href='product.html?id=${product.prod_id}'">ДЕТАЛЬНІШЕ</button>
          <button class="btn btn-outline" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">🛒</button>
        </div>
      </div>
    </div>
  `
}
// renderProductCard(product) -> html карточки товара для каталога и страницы товара


async function renderProducts(containerId, limit = null) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = 'Завантаження...'

  let products = await fetchProducts()

  if (limit) products = products.slice(0, limit)

  if (products.length === 0) {
    container.innerHTML = 'Товари не знайдені'
    return
  }

  container.innerHTML = products.map(renderProductCard).join('')
}
// renderProducts('catalog') — все товары
// renderProducts('popular-products', 4) — только первые 4

async function renderProductById(containerId, productId) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = 'Завантаження...'
  const product = await fetchProductById(productId)
  if (!product) {
    container.innerHTML = 'Товар не знайдений'
    return
  }
  container.innerHTML = renderProductCard(product) 
}
// renderProductById('product-container', 5) -> редерит продукт с id=5 в <div id="product-container">