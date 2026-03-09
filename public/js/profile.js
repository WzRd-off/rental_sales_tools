const PROFILE_URL = `${API_URL}/api/profile`;

function authHeaders() {
    const user = storage.get('user');
    return {
        'Content-Type': 'application/json',
        'user-id': user ? user.user_id : null,
    };
}



async function loadProfile() {
    try {
        const res  = await fetch(`${PROFILE_URL}/info`, { headers: authHeaders() });
        const json = await res.json();
        if (!json.success) return showToast(json.message, 'error');

        const u = json.data;


        const initials = (u.company_name || u.fullname || '??')
            .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        setText('hero-avatar', initials);
        setText('hero-name',   u.company_name || u.fullname || '—');
        setText('hero-edrpou', u.edrpou || '—');
        setText('hero-email',  u.email  || '—');

        setVal('field-company-name',  u.company_name);
        setVal('field-edrpou',        u.edrpou);
        setVal('field-legal-address', u.legal_address);
        setVal('field-phone',         u.number);
        setVal('field-email-docs',    u.email);

        const [last = '', first = '', mid = ''] = (u.fullname || '').split(' ');
        setVal('field-last',       last);
        setVal('field-first',      first);
        setVal('field-mid',        mid);
        setVal('field-email-user', u.email);
        setVal('field-phone-user', u.number);

    } catch (err) {
        console.error('loadProfile:', err);
        showToast('Помилка завантаження профілю', 'error');
    }
}



async function loadHistory() {
    try {
        const res  = await fetch(`${PROFILE_URL}/history`, { headers: authHeaders() });
        const json = await res.json();
        if (!json.success) return showToast(json.message, 'error');

        console.log('history:', json.data); 
    } catch (err) {
        console.error('loadHistory:', err);
        showToast('Помилка завантаження історії', 'error');
    }
}



async function submitUpdate() {
    const fullname = [getVal('field-last'), getVal('field-first'), getVal('field-mid')]
        .filter(Boolean).join(' ');

    const body = {
        email:         getVal('field-email-user') || getVal('field-email-docs'),
        fullname,
        number:        getVal('field-phone-user') || getVal('field-phone'),
        company_name:  getVal('field-company-name'),
        edrpou:        getVal('field-edrpou'),
        legal_address: getVal('field-legal-address'),
    };

    try {
        const res  = await fetch(`${PROFILE_URL}/update`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(body),
        });
        const json = await res.json();

        if (json.success) {
            showToast('Зміни збережено', 'success');
            loadProfile();
        } else {
            showToast(json.message || 'Помилка збереження', 'error');
        }
    } catch (err) {
        console.error('submitUpdate:', err);
        showToast('Помилка мережі', 'error');
    }
}



function initUI() {
    document.querySelectorAll('.pg-profile-sidenav__item[data-panel]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pg-profile-sidenav__item').forEach(b => b.classList.remove('is-active'));
            document.querySelectorAll('.pg-profile-panel').forEach(p => p.classList.remove('is-active'));
            btn.classList.add('is-active');
            document.getElementById('panel-' + btn.dataset.panel).classList.add('is-active');
        });
    });
    document.querySelectorAll('.pg-history-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pg-history-tab').forEach(t => t.classList.remove('is-active'));
            document.querySelectorAll('.pg-tab-panel').forEach(p => p.classList.remove('is-active'));
            tab.classList.add('is-active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('is-active');
        });
    });
    document.querySelectorAll('.pg-save-bar .btn-primary').forEach(btn => {
        btn.addEventListener('click', submitUpdate);
    });
}



function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}


document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadProfile();
    loadHistory();
});