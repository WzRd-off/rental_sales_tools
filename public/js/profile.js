if (!storage.get('user')) {
    window.location.href = 'login.html'
}

const PROFILE_URL = `${API_URL}/api/profile`

function authHeaders() {
    const user = storage.get('user')
    return {
        'Content-Type': 'application/json',
        'user-id': user ? user.user_id : null,
    }
}



async function loadProfile() {
    try {
        const res  = await fetch(`${PROFILE_URL}/info`, { headers: authHeaders() })
        const json = await res.json()
        if (!json.success) return showToast(json.message, 'error')

        const u = json.data

    
        const initials = (u.company_name || u.fullname || '??')
            .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        setText('hero-avatar', initials)
        setText('hero-name',   u.company_name || u.fullname || '—')
        setText('hero-edrpou', u.edrpou  || '—')
        setText('hero-email',  u.email   || '—')

       
        setVal('field-company-name',  u.company_name)
        setVal('field-edrpou',        u.edrpou)
        setVal('field-legal-address', u.legal_address)
        setVal('field-phone',         u.number)
        setVal('field-email-docs',    u.email)

        const parts = (u.fullname || '').split(' ')
        setVal('field-last',       parts[0])
        setVal('field-first',      parts[1])
        setVal('field-mid',        parts[2])
        setVal('field-email-user', u.email)
        setVal('field-phone-user', u.number)

    } catch (err) {
        console.error('loadProfile:', err)
        showToast('Помилка завантаження профілю', 'error')
    }
}



async function loadHistory() {
    try {
        const res  = await fetch(`${PROFILE_URL}/history`, { headers: authHeaders() })
        const json = await res.json()
        if (!json.success) return showToast(json.message, 'error')

        const { purchases, rentals } = json.data

        const activeRentals = rentals.filter(r => r.status === 'Активна')
        const doneRentals   = rentals.filter(r => r.status !== 'Активна')
        const total         = purchases.length + rentals.length

   
        setText('count-all',         total)
        setText('count-rent-active', activeRentals.length)
        setText('count-rent-done',   doneRentals.length)
        setText('count-purchase',    purchases.length)
        setText('nav-count-orders',  total)

       
        const totalSpent = [...purchases, ...rentals]
            .reduce((sum, r) => sum + (r.total_price || 0), 0)
        setText('stat-total',  total)
        setText('stat-active', activeRentals.length)
        setText('stat-spent',  formatPrice(totalSpent))

        
        renderAllTab(purchases, rentals)
        renderRentActiveTab(activeRentals)
        renderRentDoneTab(doneRentals)
        renderPurchaseTab(purchases)

    } catch (err) {
        console.error('loadHistory:', err)
        showToast('Помилка завантаження історії', 'error')
    }
}

  

function fmtDate(str) {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(status) {
    const map = {
        'Активна':    'badge-success',
        'Завершена':  'badge-gray',
        'Прострочена':'badge-danger',
    }
    const cls = map[status] || 'badge-gray'
    return `<span class="badge ${cls}">${status || '—'}</span>`
}

function emptyRow(colspan) {
    return `<tr><td colspan="${colspan}" style="text-align:center;padding:var(--sp-8);color:var(--c-text-3)">Немає записів</td></tr>`
}

function detailHTML(item, type, colspan) {
    const photo  = item.photo
        ? `<img src="${item.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:2px">`
        : '🔧'
    const extra  = type === 'rent'
        ? `<span class="pg-order-item__dates">${fmtDate(item.start_date)} – ${fmtDate(item.end_date)}</span>`
        : `<span class="pg-order-item__qty">×${item.quantity || 1}</span>`

    return `
      <tr class="pg-order-detail-row" id="detail-${type}-${item.history_id}">
        <td colspan="${colspan}" class="pg-order-detail-cell">
          <div class="pg-order-detail-inner">
            <div class="pg-order-items">
              <div class="pg-order-item">
                <div class="pg-order-item__icon">${photo}</div>
                <div style="flex:1">
                  <div class="pg-order-item__name">${item.name || '—'}</div>
                  <div class="pg-order-item__sku">ID: ${item.prod_id}</div>
                </div>
                ${extra}
                <div class="pg-order-item__price">${formatPrice(item.total_price || 0)}</div>
              </div>
            </div>
          </div>
        </td>
      </tr>`
}

function renderAllTab(purchases, rentals) {
    const tbody = document.getElementById('tbody-all')
    if (!tbody) return

    const rows = [
        ...purchases.map(p => ({ ...p, _type: 'purchase' })),
        ...rentals.map(r => ({ ...r, _type: 'rent' })),
    ].sort((a, b) => new Date(b.order_date) - new Date(a.order_date))

    if (!rows.length) { tbody.innerHTML = emptyRow(7); return }

    tbody.innerHTML = rows.map(item => {
        const typeBadge = item._type === 'rent'
            ? '<span class="badge badge-blue">Оренда</span>'
            : '<span class="badge badge-warning">Покупка</span>'
        const rowId = `${item._type}-${item.history_id}`
        return `
          <tr class="pg-order-row" data-order="${rowId}">
            <td><span class="pg-order-expand">▶</span></td>
            <td class="td-num">#${item.history_id}</td>
            <td class="text-sm">${fmtDate(item.order_date)}</td>
            <td>${typeBadge}</td>
            <td>${item._type === 'rent' ? statusBadge(item.status) : '<span class="badge badge-success">Доставлено</span>'}</td>
            <td class="td-num">${formatPrice(item.total_price || 0)}</td>
            <td><button class="btn btn-sm btn-outline">Деталі</button></td>
          </tr>
          ${detailHTML(item, item._type, 7)}`
    }).join('')
}

function renderRentActiveTab(rentals) {
    const tbody = document.getElementById('tbody-rent-active')
    if (!tbody) return
    if (!rentals.length) { tbody.innerHTML = emptyRow(6); return }

    tbody.innerHTML = rentals.map(item => {
        const soon     = item.end_date && new Date(item.end_date) < new Date(Date.now() + 3 * 86400000)
        const retColor = soon ? 'var(--c-warning)' : 'var(--c-success)'
        const rowId    = `rent-${item.history_id}`
        return `
          <tr class="pg-order-row" data-order="${rowId}">
            <td><span class="pg-order-expand">▶</span></td>
            <td class="td-num">#${item.history_id}</td>
            <td class="text-sm">${fmtDate(item.start_date)}</td>
            <td><span style="color:${retColor};font-family:var(--font-mono);font-size:0.82rem">${fmtDate(item.end_date)}</span></td>
            <td class="td-num">${formatPrice(item.total_price || 0)}</td>
            <td style="display:flex;gap:6px;padding:10px 16px">
              <button class="btn btn-sm btn-outline">Рахунок</button>
            </td>
          </tr>
          ${detailHTML(item, 'rent', 6)}`
    }).join('')
}

function renderRentDoneTab(rentals) {
    const tbody = document.getElementById('tbody-rent-done')
    if (!tbody) return
    if (!rentals.length) { tbody.innerHTML = emptyRow(6); return }

    tbody.innerHTML = rentals.map(item => {
        const rowId = `rentdone-${item.history_id}`
        return `
          <tr class="pg-order-row" data-order="${rowId}">
            <td><span class="pg-order-expand">▶</span></td>
            <td class="td-num">#${item.history_id}</td>
            <td class="text-sm">${fmtDate(item.order_date)}</td>
            <td>${statusBadge(item.status)}</td>
            <td class="td-num">${formatPrice(item.total_price || 0)}</td>
            <td><button class="btn btn-sm btn-outline">Рахунок</button></td>
          </tr>
          ${detailHTML(item, 'rentdone', 6)}`
    }).join('')
}

function renderPurchaseTab(purchases) {
    const tbody = document.getElementById('tbody-purchase')
    if (!tbody) return
    if (!purchases.length) { tbody.innerHTML = emptyRow(6); return }

    tbody.innerHTML = purchases.map(item => {
        const rowId = `purchase-${item.history_id}`
        return `
          <tr class="pg-order-row" data-order="${rowId}">
            <td><span class="pg-order-expand">▶</span></td>
            <td class="td-num">#${item.history_id}</td>
            <td class="text-sm">${fmtDate(item.order_date)}</td>
            <td class="td-num">${item.quantity || 1}</td>
            <td class="td-num">${formatPrice(item.total_price || 0)}</td>
            <td><button class="btn btn-sm btn-outline">Рахунок</button></td>
          </tr>
          ${detailHTML(item, 'purchase', 6)}`
    }).join('')
}



async function submitUpdate() {
    const fullname = [getVal('field-last'), getVal('field-first'), getVal('field-mid')]
        .filter(Boolean).join(' ')

    const body = {
        email:         getVal('field-email-user') || getVal('field-email-docs'),
        fullname,
        number:        getVal('field-phone-user') || getVal('field-phone'),
        company_name:  getVal('field-company-name'),
        edrpou:        getVal('field-edrpou'),
        legal_address: getVal('field-legal-address'),
    }

    try {
        const res  = await fetch(`${PROFILE_URL}/update`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(body),
        })
        const json = await res.json()

        if (json.success) {
            
            const user = storage.get('user')
            storage.set('user', { ...user, ...body })
            showToast('Зміни збережено', 'success')
            loadProfile()
        } else {
            showToast(json.message || 'Помилка збереження', 'error')
        }
    } catch (err) {
        console.error('submitUpdate:', err)
        showToast('Помилка мережі', 'error')
    }
}



function initUI() {
  
    document.querySelectorAll('.pg-profile-sidenav__item[data-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pg-profile-sidenav__item').forEach(b => b.classList.remove('is-active'))
            document.querySelectorAll('.pg-profile-panel').forEach(p => p.classList.remove('is-active'))
            btn.classList.add('is-active')
            document.getElementById('panel-' + btn.dataset.panel).classList.add('is-active')
        })
    })

   
    document.querySelectorAll('.pg-history-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pg-history-tab').forEach(t => t.classList.remove('is-active'))
            document.querySelectorAll('.pg-tab-panel').forEach(p => p.classList.remove('is-active'))
            tab.classList.add('is-active')
            document.getElementById('tab-' + tab.dataset.tab).classList.add('is-active')
        })
    })

    
    document.addEventListener('click', e => {
        const row = e.target.closest('.pg-order-row')
        if (!row) return
        const detail = document.getElementById('detail-' + row.dataset.order)
        if (!detail) return
        const isOpen = row.classList.contains('is-open')
        document.querySelectorAll('.pg-order-row.is-open').forEach(r => {
            r.classList.remove('is-open')
            const d = document.getElementById('detail-' + r.dataset.order)
            if (d) d.classList.remove('is-active')
        })
        if (!isOpen) { row.classList.add('is-open'); detail.classList.add('is-active') }
    })

    
    document.getElementById('btn-save-company')?.addEventListener('click', submitUpdate)
    document.getElementById('btn-save-user')?.addEventListener('click', submitUpdate)

    
    document.getElementById('btn-discard-company')?.addEventListener('click', loadProfile)
    document.getElementById('btn-discard-user')?.addEventListener('click', loadProfile)

    
    ;[['eye-current','pwd-current'], ['eye-new','pwd-new'], ['eye-confirm','pwd-confirm']]
        .forEach(([btnId, inputId]) => {
            document.getElementById(btnId)?.addEventListener('click', () => {
                const input = document.getElementById(inputId)
                const btn   = document.getElementById(btnId)
                input.type  = input.type === 'password' ? 'text' : 'password'
                btn.textContent = input.type === 'password' ? '👁' : '🙈'
            })
        })

        document.getElementById('btn-logout')?.addEventListener('click', () => {
        storage.remove('user')
        window.location.href = 'login.html'
    })

  
    document.getElementById('pwd-new')?.addEventListener('input', calcStrength)
}

function calcStrength() {
    const v     = document.getElementById('pwd-new').value
    const score = [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length
    const cls   = ['', 'is-weak', 'is-fair', 'is-strong', 'is-strong']
    const lbl   = ['Введіть пароль', 'Слабкий', 'Задовільний', 'Добрий', 'Надійний']
    ;['s1','s2','s3','s4'].forEach((id, i) => {
        const el = document.getElementById(id)
        if (el) el.className = 'pg-strength-seg' + (i < score ? ' ' + cls[score] : '')
    })
    setText('strength-label', v.length ? lbl[score] : lbl[0])
}



function setText(id, val) {
    const el = document.getElementById(id)
    if (el) el.textContent = val
}
function setVal(id, val) {
    const el = document.getElementById(id)
    if (el) el.value = val || ''
}
function getVal(id) {
    const el = document.getElementById(id)
    return el ? el.value.trim() : ''
}


document.addEventListener('DOMContentLoaded', () => {
    initUI()
    loadProfile()
    loadHistory()
})
