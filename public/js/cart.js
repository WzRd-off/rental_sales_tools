function getCart() {
  return storage.get('cart') || []
}
// getCart() -> возвращает массив товаров из localStorage

function saveCart(cart) {
  storage.set('cart', cart)
}
// saveCart(cart) -> записывает массив корзины в localStorage

function addToCart(product) {
  const cart = getCart()
  const existing = cart.find(item => item.prod_id === product.prod_id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  saveCart(cart)
  showToast(`${product.name} додано до кошика`, 'success')
}
// addToCart(product) -> добавляет товар, если уже есть — увеличивает количество на 1


function removeFromCart(prod_id) {
  saveCart(getCart().filter(item => item.prod_id !== prod_id))
  renderCart()
}
// removeFromCart(5) -> удаляет товар по id и перерисовывает корзину

function changeQuantity(prod_id, delta) {
  const cart = getCart()
  const item = cart.find(i => i.prod_id === prod_id)
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta)
    saveCart(cart)
    renderCart()
  }
}
// changeQuantity(5, +1) или changeQuantity(5, -1) -> меняет количество на ±1

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.cost * item.quantity, 0)
}
// getCartTotal() -> возвращает общую сумму корзины числом

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}
// getCartCount() -> возвращает общее количество товаров (для бейджика в хедере)

function renderCartItem(item) {
  return `
    <div class="card p-4 flex items-center gap-6" data-id="${item.prod_id}">
      <div class="product-card__img" style="width: 80px; height: 80px; flex-shrink: 0;">
        <div class="product-card__icon" style="font-size: 1.5rem;">🛠️</div>
      </div>
      <div style="flex-grow: 1;">
        <div class="product-card__sku">ID: ${item.prod_id}</div>
        <h3 class="font-bold uppercase text-sm mb-2">${item.name}</h3>
        <div class="text-3 text-sm">${item.category}</div>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-outline btn-sm" style="padding: 2px 10px;"
          onclick="changeQuantity(${item.prod_id}, -1)">−</button>
        <input type="text" class="input num text-center" value="${item.quantity}"
          style="width: 50px; padding: 5px;"
          onchange="changeQuantity(${item.prod_id}, +this.value - ${item.quantity}); renderCart()">
        <button class="btn btn-outline btn-sm" style="padding: 2px 10px;"
          onclick="changeQuantity(${item.prod_id}, +1)">+</button>
      </div>
      <div class="num font-bold text-brand" style="width: 110px; text-align: right;">
        ${formatPrice(item.cost * item.quantity)}
      </div>
      <button class="header__icon-btn" style="color: var(--c-danger);"
        onclick="removeFromCart(${item.prod_id})">✕</button>
    </div>
  `
}
// renderCartItem(item) -> возвращает HTML одной строки корзины

function renderCart() {
  const container = document.getElementById('cart-items-container')
  if (!container) return

  const cart = getCart()

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-3">Кошик порожній</p>'
  } else {
    container.innerHTML = cart.map(renderCartItem).join('')
  }

  document.getElementById('cart-total-count').textContent = getCartCount() + ' шт'
  document.getElementById('cart-total-price').textContent = formatPrice(getCartTotal())
}
// renderCart() -> рендерит всю корзину и обновляет сумму