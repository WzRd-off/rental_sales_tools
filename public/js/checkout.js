document.addEventListener('DOMContentLoaded', function() {
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

async function submitOrder() {
  const cart = storage.get('cart') || []

  if (cart.length === 0) {
    showToast('Кошик порожній', 'error')
    return
  }

  const user = storage.get('user')
  if (!user) {
    showToast('Будь ласка, увійдіть в систему', 'error')
    window.location.href = '/login.html'
    return
  }

  const items = cart.map(item => {
    const orderItem = {
      prodId:   item.id,
      type:     item.type === 'rent' ? 'rent' : 'sell',
      quantity: item.quantity
    }
    if (item.type === 'rent') {
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(today.getDate() + item.days)
      orderItem.startDate = today.toISOString().split('T')[0]
      orderItem.endDate   = endDate.toISOString().split('T')[0]
    }
    return orderItem
  })

  const btn = document.getElementById('submit-btn')
  if (btn) {
    btn.disabled = true
    btn.textContent = 'Відправляємо...'
  }

  try {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.user_id,
        items:  items
      })
    })

    const data = await res.json()

    if (data.success) {
      storage.remove('cart')
      updateCartBadge()
      showToast('Замовлення успішно оформлено!', 'success')
      setTimeout(() => {
        window.location.href = '/index.html'
      }, 1500)
    } else {
      showToast(data.message || 'Помилка оформлення замовлення', 'error')
      if (btn) {
        btn.disabled = false
        btn.textContent = 'ОФОРМИТИ ЗАМОВЛЕННЯ'
      }
    }

  } catch(e) {
    console.error('Помилка:', e)
    showToast('Помилка сервера, спробуйте пізніше', 'error')
    if (btn) {
      btn.disabled = false
      btn.textContent = 'ОФОРМИТИ ЗАМОВЛЕННЯ'
    }
  }
}

function validateForm() {
  let isValid = true

  const name = document.getElementById('user-name')
  if (name && name.value.trim().length < 3) {
    showError(name, 'name-error')
    isValid = false
  } else if (name) {
    hideError(name, 'name-error')
  }

  const phone = document.getElementById('user-phone')
  if (phone) {
    const cleanPhone = phone.value.replace(/\D/g, '')
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      showError(phone, 'phone-error')
      isValid = false
    } else {
      hideError(phone, 'phone-error')
    }
  }

  return isValid
}

function showError(input, errorId) {
  input.classList.add('input-error')
  const errorEl = document.getElementById(errorId)
  if (errorEl) errorEl.style.display = 'block'
}

function hideError(input, errorId) {
  input.classList.remove('input-error')
  const errorEl = document.getElementById(errorId)
  if (errorEl) errorEl.style.display = 'none'
}