let allProducts = []

function applyFilters() {
    const category = document.getElementById('filter-category').value
    const status = document.getElementById('filter-status').value
    const priceMin = parseFloat(document.getElementById('price-min').value) || 0
    const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity
    const search = document.getElementById('filter-search').value.toLowerCase().trim()

    const filtered = allProducts.filter(p => {
        if (category !== 'all' && p.category !== category) return false
        if (status !== 'all' && p.status !== status) return false
        if (p.cost < priceMin || p.cost > priceMax) return false
        if (search && !p.name.toLowerCase().includes(search)) return false
        return true
    })

    const grid = document.getElementById('catalog-grid')
    const count = document.getElementById('products-count')

    grid.innerHTML = filtered.length > 0
        ? filtered.map(renderProductCard).join('')
        : '<p class="text-3" style="grid-column: 1/-1; padding: 40px 0; color: #64748b;">Товари не знайдені</p>'

    count.textContent = `Знайдено: ${filtered.length} товарів`
}

document.addEventListener('DOMContentLoaded', async function() {
    const grid = document.getElementById('catalog-grid')

    try {
        const res = await fetch('/api/catalog/products/')
        const data = await res.json() 

        if (data.success && data.data.length > 0) {
            allProducts = data.data

            // Динамічно заповнюємо категорії з БД
            const categories = [...new Set(allProducts.map(p => p.category))]
            const categorySelect = document.getElementById('filter-category')
            categories.forEach(cat => {
                const opt = document.createElement('option')
                opt.value = cat
                opt.textContent = cat
                categorySelect.appendChild(opt)
            })

            applyFilters()
        } else {
            grid.innerHTML = '<p class="text-3">Товари не знайдені</p>'
        }
    } catch(e) {
        console.error(e)
        grid.innerHTML = '<p class="text-3">Помилка завантаження товарів</p>'
    }

    document.getElementById('filter-form').addEventListener('submit', function(e) {
        e.preventDefault()
        applyFilters()
    })

    document.getElementById('filter-reset').addEventListener('click', function() {
        setTimeout(applyFilters, 0)
    })
})

