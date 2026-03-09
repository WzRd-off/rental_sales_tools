document.addEventListener('DOMContentLoaded', function() {

  const loginBtn = document.querySelector('#loginCard .btn-primary')
  if (loginBtn) {
    loginBtn.addEventListener('click', async function() {
      const email    = document.getElementById('login_email').value.trim()
      const password = document.getElementById('login_password').value.trim()

      if (!email || !password) {
        showToast('Введіть email та пароль', 'error')
        return
      }

      loginBtn.disabled = true
      loginBtn.textContent = 'Завантаження...'

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (data.success) {
          storage.set('user', data.data)  
          showToast('Вхід успішний!', 'success')
          setTimeout(() => {
            window.location.href = '/index.html'
          }, 1000)
        } else {
          showToast(data.message || 'Невірний email або пароль', 'error')
          loginBtn.disabled = false
          loginBtn.textContent = 'Увійти'
        }

      } catch(e) {
        console.error('Помилка входу:', e)
        showToast('Помилка сервера', 'error')
        loginBtn.disabled = false
        loginBtn.textContent = 'Увійти'
      }
    })
  }

  const registerBtn = document.querySelector('#registerCard .btn-primary')
  if (registerBtn) {
    registerBtn.addEventListener('click', async function() {
      const fullname        = document.getElementById('fullname').value.trim()
      const email           = document.getElementById('email').value.trim()
      const phone           = document.getElementById('phone').value.trim()
      const password        = document.getElementById('password').value.trim()
      const company_name    = document.getElementById('company_name').value.trim()
      const company_code    = document.getElementById('company_code').value.trim()
      const company_address = document.getElementById('company_address').value.trim()

      if (!fullname || !email || !phone || !password || !company_name || !company_code || !company_address) {
        showToast('Заповніть всі поля', 'error')
        return
      }

      if (password.length < 6) {
        showToast('Пароль має бути мінімум 6 символів', 'error')
        return
      }

      const phoneRegex = /^\+\d{1,3}\d{9,15}$/
      if (!phoneRegex.test(phone)) {
        showToast('Введіть телефон у форматі +380671234567', 'error')
        return
      }

      registerBtn.disabled = true
      registerBtn.textContent = 'Реєстрація...'

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullname,
            email,
            number:        phone,
            password,
            company_name,
            edrpou:        company_code,
            legal_address: company_address
          })
        })

        const data = await res.json()

        if (data.success) {
          showToast('Реєстрація успішна! Увійдіть в систему', 'success')
          setTimeout(() => {
            document.getElementById('registerCard').classList.add('view')
            document.getElementById('loginCard').classList.remove('view')
            document.getElementById('showRegister').classList.remove('view')
          }, 1500)
        } else {
          showToast(data.message || 'Помилка реєстрації', 'error')
          registerBtn.disabled = false
          registerBtn.textContent = 'Зареєструватися'
        }

      } catch(e) {
        console.error('Помилка реєстрації:', e)
        showToast('Помилка сервера', 'error')
        registerBtn.disabled = false
        registerBtn.textContent = 'Зареєструватися'
      }
    })
  }

})