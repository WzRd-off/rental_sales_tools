 const navLinks = [
  { label: 'Головна',       href: '/index.html' },
  { label: 'Каталог',       href: '/catalog.html' },
  { label: 'Оренда',        href: '/catalog.html?type=rent' },
  { label: 'Про компанію',  href: '/about.html' },
]


function renderHeader() {
  const currentPath = window.location.pathname

  const navHTML = navLinks.map(link => {
    const isActive = currentPath.includes(link.href.split('?')[0])
    return `<a href="${link.href}" class="${isActive ? 'active' : ''}">${link.label}</a>`
  }).join('')

  const cart = storage.get('cart') || []
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const user = storage.get('user')
  const userHTML = user
    ? `<div class="header__user">
         <div class="header__avatar">${user.company.slice(0,2).toUpperCase()}</div>
         <span class="header__user-name">${user.company}</span>
       </div>`
    : `<a href="/login.html" class="btn btn-primary btn-sm">Вхід</a>`

  const html = `
    <header class="header">
      <div class="container">
        <div class="header__inner">

          <a href="/index.html" class="header__logo">
            <div class="header__logo-mark">
              <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:none;stroke:#fff;stroke-width:2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            БудІнструмент
          </a>

          <div class="header__sep"></div>

          <nav class="header__nav">
            ${navHTML}
          </nav>

          <div class="header__search">
            <span class="header__search-icon">
              <svg style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input type="text" id="search-input" placeholder="Пошук за артикулом..."/>
          </div>

          <div class="header__actions">
            <button class="header__icon-btn" onclick="window.location.href='/cart.html'">
              <svg style="width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              ${cartCount > 0 ? `<span class="header__badge">${cartCount}</span>` : ''}
            </button>

            <div class="header__sep"></div>
            ${userHTML}
          </div>

        </div>
      </div>
    </header>
  `

  const target = document.getElementById('header')
  if (target) target.innerHTML = html

  initSearch()
}

function initSearch() {
  const input = document.getElementById('search-input')
  if (!input) return

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = '/catalog.html?search=' + encodeURIComponent(input.value.trim())
    }
  })
}

function renderFooter() {
  const html = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">

          <div>
            <div class="footer__logo">
              <div class="footer__logo-mark"></div>
              БудІнструмент
            </div>
            <p class="footer__desc">
              B2B Платформа для професійного будівництва. Оренда, продаж та сервісне обслуговування інструменту.
            </p>
          </div>

          <div>
            <div class="footer__col-title">Навігація</div>
            <ul class="footer__links">
              <li><a href="/catalog.html">Каталог товарів</a></li>
              <li><a href="/catalog.html?type=rent">Тарифи оренди</a></li>
              <li><a href="#">Доставка</a></li>
            </ul>
          </div>

          <div>
            <div class="footer__col-title">Клієнтам</div>
            <ul class="footer__links">
              <li><a href="/profile.html">Осо
[06.03.2026 16:55] Chymachechi1: бистий кабінет</a></li>
              <li><a href="/profile.html#orders">Історія замовлень</a></li>
              <li><a href="#">Техпідтримка</a></li>
            </ul>
          </div>

          <div>
            <div class="footer__col-title">Контакти</div>
            <ul class="footer__links">
              <li><a href="tel:+380441234567">+38 (044) 123-45-67</a></li>
              <li>м. Київ, вул. Будівельників, 40</li>
            </ul>
          </div>

        </div>
        <div class="footer__bottom">
          <span>© 2026 БУДІНСТРУМЕНТ. ВСІ ПРАВА ЗАХИЩЕНІ.</span>
          <div class="flex gap-4">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  `

  const target = document.getElementById('footer')
  if (target) target.innerHTML = html
}

function updateCartBadge() {
  const cart = storage.get('cart') 
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const badge = document.querySelector('.header__badge')

  if (count > 0) {
    if (badge) {
      badge.textContent = count
    } else {
      const btn = document.querySelector('.header__icon-btn')
      if (btn) {
        const newBadge = document.createElement('span')
        newBadge.className = 'header__badge'
        newBadge.textContent = count
        btn.appendChild(newBadge)
      }
    }
  } else {
    if (badge) badge.remove()
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderHeader()
  renderFooter()
})