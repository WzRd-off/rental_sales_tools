
    // ---------- РЕНДЕР КОШИКА ----------
    function renderCart() {
        const cart = storage.get('cart') || []
        const container = document.getElementById('cart-items-container')
        const cartContent = document.getElementById('cart-content')
        const cartEmpty = document.getElementById('cart-empty')

        if (cart.length === 0) {
            cartEmpty.style.display = 'block'
            cartContent.style.display = 'none'
            return
        }

        cartEmpty.style.display = 'none'
        cartContent.style.display = 'grid'

        container.innerHTML = cart.map(item => `
            <div class="card p-4" data-id="${item.id}" style="display: flex; align-items: center; gap: 16px;">
                <div class="product-card__img" style="width: 80px; height: 80px; flex-shrink: 0; border-radius: 8px; overflow: hidden; background: #f8fafc;">
                    <img src="/images/${item.photo || ''}" alt="${item.name}"
                         style="width: 100%; height: 100%; object-fit: contain;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="product-card__icon" style="display:none; font-size: 1.5rem;">🛠️</div>
                </div>
                <div style="flex-grow: 1;">
                    <div class="product-card__sku" style="font-size: 11px; color: #94a3b8;">SKU: ${item.id}</div>
                    <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 4px 0;">${item.name}</h3>
                    <div style="font-size: 16px; font-weight: 900; color: #0f172a;">${formatPrice(item.price)}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn btn-outline btn-sm" style="padding: 2px 10px;" onclick="changeQty(${item.id}, -1)">−</button>
                    <span style="width: 30px; text-align: center; font-weight: 700;">${item.quantity}</span>
                    <button class="btn btn-outline btn-sm" style="padding: 2px 10px;" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <div style="width: 110px; text-align: right; font-weight: 900; color: var(--c-brand);">
                    ${formatPrice(item.price * item.quantity)}
                </div>
                <button class="header__icon-btn" style="color: var(--c-danger);" onclick="removeItem(${item.id})">✕</button>
            </div>
        `).join('')

        updateSummary(cart)
    }

    function updateSummary(cart) {
        const totalCount = cart.reduce((s, i) => s + i.quantity, 0)
        const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0)
        document.getElementById('cart-total-count').textContent = `${totalCount} шт`
        document.getElementById('cart-total-price').textContent = formatPrice(totalPrice)
    }

    function changeQty(id, delta) {
        const cart = storage.get('cart') || []
        const item = cart.find(i => i.id === id)
        if (!item) return
        item.quantity += delta
        if (item.quantity <= 0) {
            cart.splice(cart.indexOf(item), 1)
        }
        storage.set('cart', cart)
        updateCartBadge()
        renderCart()
    }

    function removeItem(id) {
        const cart = (storage.get('cart') || []).filter(i => i.id !== id)
        storage.set('cart', cart)
        updateCartBadge()
        renderCart()
    }

    // ---------- ВАЛІДАЦІЯ ----------
    function showError(input, errorId) {
        input.style.borderColor = '#dc2626'
        const el = document.getElementById(errorId)
        if (el) el.style.display = 'block'
    }

    function hideError(input, errorId) {
        input.style.borderColor = '#cbd5e1'
        const el = document.getElementById(errorId)
        if (el) el.style.display = 'none'
    }

    function validateForm() {
        let isValid = true
        const name = document.getElementById('user-name')
        if (name && name.value.trim().length < 3) {
            showError(name, 'name-error'); isValid = false
        } else if (name) {
            hideError(name, 'name-error')
        }
        const phone = document.getElementById('user-phone')
        if (phone) {
            const clean = phone.value.replace(/\D/g, '')
            if (!/^[0-9]{10}$/.test(clean)) {
                showError(phone, 'phone-error'); isValid = false
            } else {
                hideError(phone, 'phone-error')
            }
        }
        return isValid
    }

    // ---------- ОФОРМЛЕННЯ ----------
    async function submitOrder() {
        const cart = storage.get('cart') || []
        if (cart.length === 0) { showToast('Кошик порожній', 'error'); return }

        const user = storage.get('user')
        if (!user) {
            showToast('Будь ласка, увійдіть в систему', 'error')
            window.location.href = '/login.html'
            return
        }

        const items = cart.map(item => {
            const orderItem = {
                prodId: item.id,
                type: item.type === 'rent' ? 'rent' : 'sell',
                quantity: item.quantity
            }
            if (item.type === 'rent') {
                const today = new Date()
                const endDate = new Date()
                endDate.setDate(today.getDate() + (item.days || 1))
                orderItem.startDate = today.toISOString().split('T')[0]
                orderItem.endDate = endDate.toISOString().split('T')[0]
            }
            return orderItem
        })

        const btn = document.getElementById('submit-btn')
        if (btn) { btn.disabled = true; btn.textContent = 'Відправляємо...' }

        try {
            const res = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.user_id, items })
            })
            const data = await res.json()
            if (data.success) {
                storage.remove('cart')
                updateCartBadge()
                showToast('Замовлення успішно оформлено!', 'success')
                setTimeout(() => { window.location.href = '/index.html' }, 1500)
            } else {
                showToast(data.message || 'Помилка оформлення замовлення', 'error')
                if (btn) { btn.disabled = false; btn.textContent = 'ОФОРМИТИ ЗАМОВЛЕННЯ' }
            }
        } catch(e) {
            console.error(e)
            showToast('Помилка сервера, спробуйте пізніше', 'error')
            if (btn) { btn.disabled = false; btn.textContent = 'ОФОРМИТИ ЗАМОВЛЕННЯ' }
        }
    }

    // ---------- ЗАПУСК ----------
    document.addEventListener('DOMContentLoaded', function() {
        renderCart()

        const form = document.getElementById('checkout-form')
        if (!form) return
        form.addEventListener('submit', async function(e) {
            e.preventDefault()
            if (!validateForm()) {
                showToast('Будь ласка, перевірте правильність заповнення полів', 'error')
                return
            }
            await submitOrder()
        })
    })