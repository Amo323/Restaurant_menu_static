const menuCategories = ['Antipasti', 'Primi', 'Secondi', 'Contorni', 'Dolci', 'Bevande'];

const menuItems = [
  { id: 'm1', name: 'Bruschetta al Pomodoro', description: 'Toasted house sourdough, heirloom tomatoes, fresh basil, garlic, extra virgin olive oil.', price: 9.5, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80', category: 'Antipasti' },
  { id: 'm2', name: 'Burrata e Prosciutto', description: 'Fresh Apulian burrata, 24-month Prosciutto di Parma, fig jam, balsamic glaze.', price: 16, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80', category: 'Antipasti', popular: true },
  { id: 'm3', name: 'Calamari Fritti', description: 'Crispy fried calamari rings, lemon wedge, house-made lemon aioli.', price: 14.5, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80', category: 'Antipasti' },
  { id: 'm4', name: 'Pappardelle al Cinghiale', description: 'Wide ribbon pasta, slow-cooked wild boar ragù, Pecorino Romano, fresh rosemary.', price: 24, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', category: 'Primi', popular: true },
  { id: 'm5', name: 'Risotto ai Funghi Porcini', description: 'Carnaroli rice, wild porcini mushrooms, truffle oil, Parmigiano Reggiano.', price: 22, image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&q=80', category: 'Primi' },
  { id: 'm6', name: 'Spaghetti alla Carbonara', description: 'Guanciale, egg yolks, Pecorino Romano, black pepper. No cream.', price: 20, category: 'Primi' },
  { id: 'm7', name: 'Bistecca alla Fiorentina', description: 'Prime T-bone steak grilled over wood fire, rosemary roasted potatoes, salsa verde. (Serves 2)', price: 65, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=800&q=80', category: 'Secondi' },
  { id: 'm8', name: 'Branzino al Forno', description: 'Whole roasted Mediterranean sea bass, lemon, capers, cherry tomatoes, white wine sauce.', price: 32, category: 'Secondi', popular: true },
  { id: 'm9', name: 'Melanzane alla Parmigiana', description: 'Layered baked eggplant, San Marzano tomato sauce, mozzarella, fresh basil.', price: 21, image: 'https://images.unsplash.com/photo-1625938146369-e092144eb7e5?w=800&q=80', category: 'Secondi' },
  { id: 'm10', name: 'Patate Arrosto', description: 'Crispy roasted fingerling potatoes, garlic, rosemary.', price: 8, category: 'Contorni' },
  { id: 'm11', name: 'Broccolini Saltati', description: 'Sautéed broccolini, chili flakes, garlic, olive oil.', price: 9, category: 'Contorni' },
  { id: 'm12', name: 'Tiramisù Classico', description: 'Espresso-soaked ladyfingers, mascarpone cream, dark cocoa powder.', price: 10, image: 'https://images.unsplash.com/photo-1571115177098-24edf7fb6608?w=800&q=80', category: 'Dolci', popular: true },
  { id: 'm13', name: 'Panna Cotta', description: 'Vanilla bean panna cotta, wild berry compote, mint.', price: 9, category: 'Dolci' },
  { id: 'm14', name: 'Aperol Spritz', description: 'Aperol, Prosecco, soda water, orange slice.', price: 12, image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800&q=80', category: 'Bevande' },
  { id: 'm15', name: 'Negroni Sbagliato', description: 'Campari, sweet vermouth, Prosecco.', price: 13, category: 'Bevande' }
];

const state = {
  search: '',
  category: 'All',
  cart: loadCart(),
  view: 'menu',
  selectedItem: null,
  selectedQuantity: 1
};

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem('la-casa-cart') || '[]');
    return savedCart.map(({ notes, ...cartItem }) => cartItem);
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem('la-casa-cart', JSON.stringify(state.cart));
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
}

function getItem(id) {
  return menuItems.find((item) => item.id === id);
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function cartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function filteredItems() {
  const query = state.search.trim().toLowerCase();
  return menuItems.filter((item) => {
    const matchesCategory = state.category === 'All' || item.category === state.category;
    const matchesSearch = !query || `${item.name} ${item.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}

function imageMarkup(item, sizeClass = '') {
  if (item.image) {
    return `<img class="${sizeClass}" src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy">`;
  }
  return `<div class="${sizeClass} image-fallback" aria-hidden="true">LC</div>`;
}


function renderHeader() {
  return `
    <header class="site-header">
      <div class="header-inner">
        <div class="brand-block">
          <h1>Leon's Restaurant</h1>
          <p>Cucina Tradizionale</p>
        </div>
        <div class="header-controls">
          <label class="search-field">
            <span aria-hidden="true">⌕</span>
            <input id="search-input" type="search" placeholder="Search menu..." value="${escapeHtml(state.search)}" aria-label="Search menu">
          </label>
        </div>
      </div>
      <nav class="category-nav" aria-label="Menu categories">
        <div class="category-scroll">
          ${['All', ...menuCategories].map((category) => `<button class="category-button ${state.category === category ? 'active' : ''}" data-category="${category}">${category}</button>`).join('')}
        </div>
      </nav>
    </header>
  `;
}

function renderMenu() {
  const items = filteredItems();
  const grouped = menuCategories.map((category) => ({
    category,
    items: items.filter((item) => item.category === category)
  })).filter((group) => group.items.length);

  return `
    <main class="menu-main">
      ${grouped.length ? grouped.map((group) => `
        <section class="menu-section" id="category-${group.category.toLowerCase()}">
          <div class="section-heading"><h2>${group.category}</h2><span></span></div>
          <div class="dish-grid">
            ${group.items.map((item) => `
              <article class="dish-card" data-item-id="${item.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(item.name)}">
                <div class="dish-copy">
                  <div>
                    <h3>${escapeHtml(item.name)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                  </div>
                  <div class="dish-meta"><strong>${money(item.price)}</strong></div>
                </div>
                <div class="dish-visual">
                  ${item.popular ? '<span class="popular-badge">★ Popular</span>' : ''}
                  ${imageMarkup(item, 'dish-image')}
                  <span class="add-mark">+</span>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      `).join('') : `
        <section class="empty-state">
          <div class="empty-mark">?</div>
          <h2>No dishes found</h2>
          <p>Try adjusting your search or filters.</p>
          <button class="text-button" data-action="clear-filters">Clear all filters</button>
        </section>
      `}
    </main>
  `;
}

function renderCartButton() {
  if (!cartCount()) return '';
  return `
    <button class="floating-cart" data-action="open-cart">
      <span class="bag-mark">▣</span>
      <span>View Order</span>
      <b>${cartCount()}</b>
    </button>
  `;
}

function renderMenuView() {
  app.innerHTML = `${renderHeader()}${renderMenu()}${renderCartButton()}`;
}

function renderCartDrawer() {
  const rows = state.cart.map((cartItem) => {
    const item = getItem(cartItem.menuItemId);
    const image = cartItem.image || item?.image;
    return `
      <article class="cart-row">
        ${image ? `<img src="${image}" alt="" class="cart-image" loading="lazy">` : '<div class="cart-image image-fallback">LC</div>'}
        <div class="cart-row-copy">
          <h3>${escapeHtml(cartItem.name)}</h3>
          <strong>${money(cartItem.price)}</strong>
        </div>
        <div class="quantity-control">
          <button data-cart-id="${cartItem.id}" data-quantity-change="-1" aria-label="Remove one ${escapeHtml(cartItem.name)}">−</button>
          <span>${cartItem.quantity}</span>
          <button data-cart-id="${cartItem.id}" data-quantity-change="1" aria-label="Add one ${escapeHtml(cartItem.name)}">+</button>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="modal-backdrop" data-action="close-cart">
      <section class="cart-drawer" role="dialog" aria-modal="true" aria-label="Your order" data-stop-close>
        <div class="drag-handle"></div>
        <header class="drawer-header">
          <h2><span class="orange-mark">▣</span> Your Order</h2>
          <button class="close-button" data-action="close-cart" aria-label="Close order">×</button>
        </header>
        <div class="cart-list">${rows || '<div class="empty-cart"><p>Your order is empty.</p></div>'}</div>
        ${state.cart.length ? `
          <footer class="drawer-footer">
            <div class="subtotal"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div>
            <button class="primary-button" data-action="place-order">Order Now <span>→</span></button>
          </footer>
        ` : ''}
      </section>
    </div>
  `;
}

function renderItemModal() {
  const item = state.selectedItem;
  return `
    <div class="modal-backdrop" data-action="close-item">
      <section class="item-drawer" role="dialog" aria-modal="true" aria-label="${escapeHtml(item.name)}" data-stop-close>
        <div class="drawer-scroll">
          <div class="item-hero">${imageMarkup(item, 'item-hero-image')}</div>
          <div class="item-heading">
            <div><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p></div>
            <strong>${money(item.price)}</strong>
          </div>

          <div class="item-options">
            <div class="quantity-line"><span>Quantity</span><div class="quantity-control"><button data-action="decrease-selected" aria-label="Decrease quantity">−</button><span>${state.selectedQuantity}</span><button data-action="increase-selected" aria-label="Increase quantity">+</button></div></div>
          </div>
          <div class="item-actions">
            <button class="primary-button" data-action="add-selected">Add to Order • ${money(item.price * state.selectedQuantity)}</button>
            <button class="secondary-button" data-action="close-item">Cancel</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderReceipt() {
  const rows = state.cart.map((cartItem) => {
    const item = getItem(cartItem.menuItemId);
    const image = cartItem.image || item?.image;
    return `
      <div class="receipt-row">
        ${image ? `<img src="${image}" alt="" class="receipt-image">` : '<div class="receipt-image image-fallback">LC</div>'}
        <span><b>${cartItem.quantity}×</b> ${escapeHtml(cartItem.name)}</span>
        <strong>${money(cartItem.price * cartItem.quantity)}</strong>
      </div>
    `;
  }).join('');
  return `
    <main class="receipt-page">
      <section class="receipt-card">
        <div class="receipt-intro"><div class="receipt-icon">▣</div><h1>Your receipt</h1><p>Thank you for dining at La Casa.</p></div>
        <div class="receipt-body"><h2>Order details</h2><div class="receipt-list">${rows}</div><div class="receipt-total"><span>Total</span><strong>${money(cartSubtotal())}</strong></div><button class="primary-button" data-action="new-order">Start a new order</button></div>
      </section>
    </main>
  `;
}

function render() {
  if (state.view === 'receipt') {
    app.innerHTML = renderReceipt();
    return;
  }
  renderMenuView();
  if (state.view === 'cart') app.insertAdjacentHTML('beforeend', renderCartDrawer());
  if (state.view === 'item' && state.selectedItem) app.insertAdjacentHTML('beforeend', renderItemModal());
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastRegion.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function openItem(item) {
  state.selectedItem = item;
  state.selectedQuantity = 1;
  state.view = 'item';
  render();
}

function addSelected() {
  const item = state.selectedItem;
  const existing = state.cart.find((cartItem) => cartItem.menuItemId === item.id);
  if (existing) existing.quantity += state.selectedQuantity;
  else state.cart.push({ id: `${item.id}-${Date.now()}`, menuItemId: item.id, name: item.name, price: item.price, image: item.image, quantity: state.selectedQuantity });
  saveCart();
  state.view = 'menu';
  state.selectedItem = null;
  render();
  showToast(`${state.selectedQuantity}× ${item.name} added to your order`);
}

function updateCartQuantity(id, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === id);
  if (!item) return;
  item.quantity += delta;
  state.cart = state.cart.filter((cartItem) => cartItem.quantity > 0);
  saveCart();
  render();
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action], [data-category], [data-item-id], [data-cart-id]');
  if (!target) return;
  if (target.dataset.action === 'close-cart' && !target.closest('[data-stop-close]')) {
    state.view = 'menu'; render(); return;
  }
  if (target.dataset.action === 'close-item' && !target.closest('[data-stop-close]')) {
    state.view = 'menu'; render(); return;
  }
  if (target.dataset.category) {
    state.category = target.dataset.category;
    render();
    if (state.category !== 'All') document.querySelector(`#category-${state.category.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (target.dataset.itemId) {
    openItem(getItem(target.dataset.itemId));
    return;
  }
  const action = target.dataset.action;
  if (action === 'clear-filters') { state.search = ''; state.category = 'All'; render(); return; }
  if (action === 'open-cart') { state.view = 'cart'; render(); return; }
  if (action === 'close-cart') { state.view = 'menu'; render(); return; }
  if (action === 'close-item') { state.view = 'menu'; render(); return; }
  if (action === 'increase-selected') { state.selectedQuantity += 1; render(); return; }
  if (action === 'decrease-selected') { state.selectedQuantity = Math.max(1, state.selectedQuantity - 1); render(); return; }
  if (action === 'add-selected') { addSelected(); return; }
  if (action === 'place-order') { state.view = 'receipt'; render(); return; }
  if (action === 'new-order') { state.cart = []; saveCart(); state.view = 'menu'; render(); return; }
  if (target.dataset.cartId && target.dataset.quantityChange) updateCartQuantity(target.dataset.cartId, Number(target.dataset.quantityChange));
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'search-input') {
    state.search = event.target.value;
    render();
    const input = document.querySelector('#search-input');
    input?.focus();
    input?.setSelectionRange(state.search.length, state.search.length);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.view !== 'menu') {
    state.view = 'menu';
    render();
  }
  if (event.key === 'Enter' && event.target.matches('.dish-card')) openItem(getItem(event.target.dataset.itemId));
});

render();