// public/js/login.js
// Якщо вже залогінений — одразу на профіль
if (storage.get('user')) {
  window.location.href = 'profile.html'
}

// ── ВХІД ─────────────────────────────────────────────────────────────────────

document.querySelector('#loginCard .btn').addEventListener('click', async () => {
  const email    = document.getElementById('login_email').value.trim()
  const password = document.getElementById('login_password').value.trim()

  if (!email || !password) {
    showToast('Заповніть всі поля', 'error')
    return
  }

  try {
    const res  = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Помилка входу')

    storage.set('user', data.user)

    showToast('Ласкаво просимо!', 'success')
    setTimeout(() => window.location.href = 'profile.html', 1000)

  } catch (e) {
    console.error(e)
    showToast(e.message, 'error')
  }
})

// ── РЕЄСТРАЦІЯ ────────────────────────────────────────────────────────────────

document.querySelector('#registerCard .btn').addEventListener('click', async () => {
  const fullname         = document.getElementById('fullname').value.trim()
  const email            = document.getElementById('email').value.trim()
  const phone            = document.getElementById('phone').value.trim()
  const password         = document.getElementById('password').value.trim()
  const company_name     = document.getElementById('company_name').value.trim()
  const company_code     = document.getElementById('company_code').value.trim()
  const company_address  = document.getElementById('company_address').value.trim()

  if (!fullname || !email || !phone || !password || !company_name || !company_code || !company_address) {
    showToast('Заповніть всі поля', 'error')
    return
  }

  try {
    const res  = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, phone, password, company_name, company_code, company_address })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Помилка реєстрації')

    // auth.controller повертає user — одразу логінимо і на профіль
    storage.set('user', data.user)

    showToast('Реєстрація успішна!', 'success')
    setTimeout(() => window.location.href = 'profile.html', 1000)

  } catch (e) {
    console.error(e)
    showToast(e.message, 'error')
  }
})