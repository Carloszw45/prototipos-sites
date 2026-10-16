(function () {
  'use strict';
  const store = window.FloreStore;
  const { products, categories, productMap, money, cartLines, cartTotal, cartCount, selectProducts } = store;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const paths = {
    bag: '<path d="M6 7h12l2 14H4L6 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    search: '<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.2 16.2 4.3 4.3"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    flower: '<path d="M12 7C7-1 1 6 7 10c-9 1-6 10 1 7-1 9 9 9 8 0 7 3 10-6 1-7 6-4 0-11-5-3Z"/><circle cx="12" cy="12" r="2.1"/>',
    sliders: '<path d="M3 6h9m5 0h4M3 12h3m5 0h10M3 18h11m5 0h2"/><circle cx="14.5" cy="6" r="2.5"/><circle cx="8.5" cy="12" r="2.5"/><circle cx="16.5" cy="18" r="2.5"/>',
    'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-up-right': '<path d="M6 18 18 6M6 6h12v12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="m6 6 12 12M6 18 18 6"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.flower}</svg>`;
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  function readSaved(key, fallback) {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback; }
    catch { return fallback; }
  }
  const state = {
    view: 'home', query: '', category: 'all', sort: 'featured',
    cart: store.sanitizeCart(readSaved('flore-demo-cart-v1', {})),
    favorites: store.sanitizeFavorites(readSaved('flore-demo-favorites-v1', [])),
    currentProduct: null, detailQuantity: 1, orderText: ''
  };
  let toastTimer;
  const toast = $('#toast');
  function notify(message) {
    clearTimeout(toastTimer);
    const currentDialog = document.querySelector('dialog[open]');
    (currentDialog || document.body).appendChild(toast);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }
  function save() {
    try {
      localStorage.setItem('flore-demo-cart-v1', JSON.stringify(state.cart));
      localStorage.setItem('flore-demo-favorites-v1', JSON.stringify(state.favorites));
    } catch { /* The shop also works when local storage is unavailable. */ }
    const count = cartCount(state.cart);
    $$('[data-cart-count]').forEach(el => { el.textContent = count; el.hidden = count === 0; });
    $$('.header-cart').forEach(el => { el.setAttribute('aria-label', `Abrir sacola, ${count} ${count === 1 ? 'buquê' : 'buquês'}`); });
  }
  function showDialog(id) {
    $$('dialog[open]').forEach(dialog => { if (dialog.id !== id) dialog.close(); });
    const dialog = document.getElementById(id);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
  }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
      if (dialog.contains(toast)) document.body.appendChild(toast);
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  function renderCategories() {
    $('#categories').innerHTML = categories.map(category => `<button class="category-card ${state.category === category.id ? 'is-selected' : ''}" data-category="${category.id}" aria-label="Ver buquês de ${category.name}"><span class="category-image"><img src="./assets/${category.image}" alt="" width="368" height="460"></span><span><strong>${category.name}</strong><small>${category.note}</small></span><span class="category-arrow">${icon('arrow-up-right')}</span></button>`).join('');
  }
  function renderSpecials() {
    const specials = [
      { id: 'doce-encanto', eyebrow: 'LEVEZA EM CADA FLOR', title: 'Um doce<br>carinho.', label: 'Doce Encanto' },
      { id: 'jardim-lilas', eyebrow: 'A COR DA DELICADEZA', title: 'Afeto em<br>tons de lilás.', label: 'Jardim Lilás' },
      { id: 'amor-em-cores', eyebrow: 'FLORES QUE DECLARAM', title: 'Para um amor<br>em cores.', label: 'Amor em Cores' }
    ];
    $('#specials').innerHTML = specials.map(special => {
      const product = productMap.get(special.id);
      return `<button class="special-card" data-product="${special.id}" aria-label="Conhecer ${product.name}"><img src="./assets/${product.image}" alt="${product.alt}" width="368" height="460"><span class="special-copy"><span>${special.eyebrow}</span><strong>${special.title}</strong><span class="special-cta">Conheça o buquê ${icon('arrow-up-right')}</span></span><span class="special-label">${special.label}</span></button>`;
    }).join('');
  }
  function renderProducts() {
    const isFavoriteView = state.view === 'favorites';
    const list = selectProducts({ query: state.query, category: state.category, sort: state.sort, favorites: isFavoriteView ? state.favorites : null });
    const isHome = state.view === 'home' && !state.query && state.category === 'all';
    $$('.home-section').forEach(section => { section.hidden = !isHome; });
    const category = categories.find(item => item.id === state.category);
    $('#catalog-title').textContent = isFavoriteView ? 'Seus favoritos' : state.query ? 'Flores para você' : category ? category.name === 'Do campo' ? 'Flores do campo' : category.name : isHome ? 'Os queridinhos' : 'Todos os buquês';
    $('#catalog-caption').textContent = isHome ? 'Um buquê para cada sentimento.' : `${list.length} ${list.length === 1 ? 'buquê para descobrir' : 'buquês para descobrir'}.`;
    $('#show-all').hidden = !isHome;
    $('#products').innerHTML = list.map((product, index) => {
      const favorite = state.favorites.includes(product.id);
      return `<article class="product-card"><button class="product-open" data-product="${product.id}" aria-label="Ver detalhes de ${product.name}, ${money(product.price)}"><img class="product-image" src="./assets/${product.image}" alt="${product.alt}" width="368" height="460" ${index > 3 ? 'loading="lazy"' : ''}><span class="product-info"><strong>${product.name}</strong><span class="product-price">${money(product.price)}</span><span class="product-note">ilustrativo</span></span></button><button class="product-action favorite-button ${favorite ? 'is-favorite' : ''}" data-favorite="${product.id}" aria-label="${favorite ? 'Remover ' : 'Salvar '}${product.name} ${favorite ? 'dos' : 'nos'} favoritos" aria-pressed="${favorite}">${icon('heart')}</button><button class="product-action quick-add" data-add="${product.id}" aria-label="Adicionar ${product.name} à sacola">${icon('bag')}</button></article>`;
    }).join('');
    $('#no-products').hidden = list.length > 0;
    $('#empty-description').textContent = isFavoriteView && !state.query ? 'Toque no coração de um buquê para guardar seus preferidos.' : 'Experimente buscar por outra flor ou ajustar os filtros.';
    const filters = [];
    if (state.query) filters.push(`<button class="active-filter" data-clear="query">Busca: ${escapeHTML(state.query)} ${icon('x')}</button>`);
    if (category) filters.push(`<button class="active-filter" data-clear="category">${category.name} ${icon('x')}</button>`);
    if (state.sort !== 'featured') filters.push(`<button class="active-filter" data-clear="sort">${({ 'price-asc': 'Menor preço', 'price-desc': 'Maior preço', name: 'Nome do buquê' })[state.sort]} ${icon('x')}</button>`);
    $('#active-filters').innerHTML = filters.join('');
    $('#active-filters').hidden = filters.length === 0;
    $('.filter-button').classList.toggle('has-filter', state.category !== 'all' || state.sort !== 'featured');
    $$('[data-view]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.view === state.view);
      if (el.dataset.view === state.view) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });
  }
  function setView(view, scroll = true) {
    state.view = view;
    state.query = ''; state.category = 'all'; state.sort = 'featured';
    $('#search').value = '';
    renderProducts();
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function favorite(id) {
    if (!productMap.has(id)) return;
    const adding = !state.favorites.includes(id);
    state.favorites = adding ? [...state.favorites, id] : state.favorites.filter(value => value !== id);
    save(); renderProducts();
    const detailFavorite = $('[data-detail-favorite]');
    if (detailFavorite && state.currentProduct === id) {
      detailFavorite.setAttribute('aria-pressed', String(adding));
      detailFavorite.setAttribute('aria-label', adding ? 'Remover dos favoritos' : 'Salvar nos favoritos');
      detailFavorite.querySelector('svg').style.fill = adding ? 'currentColor' : 'none';
    }
    notify(adding ? 'Um carinho guardado nos favoritos ♡' : 'Buquê removido dos favoritos');
  }
  function addToCart(id, quantity = 1) {
    if (!productMap.has(id)) return;
    const current = state.cart[id] || 0;
    const next = store.clampQuantity(current + quantity);
    state.cart[id] = next;
    save();
    if ($('#product-dialog').open) $('#product-dialog').close();
    notify(current === 99 ? 'Limite de 99 unidades por buquê.' : 'Seu buquê está na sacola ♡');
  }
  function openProduct(id) {
    const product = productMap.get(id);
    if (!product) return;
    state.currentProduct = id; state.detailQuantity = 1;
    const isFavorite = state.favorites.includes(id);
    $('#product-detail').innerHTML = `<header class="dialog-header detail-header"><button class="icon-button back-button" data-close="product-dialog" aria-label="Voltar ao catálogo">${icon('arrow-left')}</button><h2>Detalhes</h2><button class="icon-button" data-detail-favorite="${id}" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}" aria-pressed="${isFavorite}">${icon('heart')}</button></header><div class="detail-layout"><div class="detail-visual"><img class="detail-image" src="./assets/${product.image}" alt="${product.alt}" width="368" height="460"><div class="photo-dots" aria-hidden="true"><span></span><span></span><span></span></div></div><div class="detail-panel"><span class="detail-eyebrow">SELEÇÃO FLORÊ</span><h3>${product.name}</h3><p class="detail-subtitle">${product.subtitle}</p><h4>Um pouco sobre este buquê</h4><p class="detail-description">${product.description}</p><h4>O carinho vem de</h4><ul class="composition">${product.includes.map((item, i) => `<li><span class="flower-glyph" aria-hidden="true">${['✿', '❀', '❧'][i]}</span>${item}</li>`).join('')}</ul><div class="detail-bottom"><div class="quantity-control" aria-label="Quantidade do buquê"><button data-detail-qty="-1" aria-label="Diminuir quantidade" disabled>${icon('minus')}</button><output id="detail-quantity" aria-live="polite">01</output><button data-detail-qty="1" aria-label="Aumentar quantidade">${icon('plus')}</button></div><strong class="detail-price" id="detail-price">${money(product.price)}</strong></div><button class="primary-button detail-add full-width" data-action="add-detail">${icon('bag')} Adicionar à sacola</button><p class="detail-fine-print">Composição e valor ilustrativos para apresentação.</p></div></div>`;
    if (isFavorite) $('[data-detail-favorite] svg').style.fill = 'currentColor';
    showDialog('product-dialog');
    $('#product-dialog').scrollTop = 0;
  }
  function changeDetailQuantity(delta) {
    state.detailQuantity = Math.max(1, Math.min(99, state.detailQuantity + delta));
    $('#detail-quantity').textContent = String(state.detailQuantity).padStart(2, '0');
    $('#detail-price').textContent = money(productMap.get(state.currentProduct).price * state.detailQuantity);
    $('[data-detail-qty="-1"]').disabled = state.detailQuantity === 1;
    $('[data-detail-qty="1"]').disabled = state.detailQuantity === 99;
  }
  function renderCart() {
    const lines = cartLines(state.cart);
    const count = cartCount(state.cart);
    $('#cart-header-count').textContent = count ? `${count} ${count === 1 ? 'item' : 'itens'}` : '';
    $('#cart-items').innerHTML = lines.length ? lines.map(({ product, quantity, total }) => `<article class="cart-item"><img class="cart-item-image" src="./assets/${product.image}" alt="${product.alt}" width="99" height="115"><div class="cart-item-content"><h3>${product.name}</h3><p>${product.subtitle}</p><button class="remove-item" data-remove="${product.id}" aria-label="Remover ${product.name} da sacola">${icon('trash')}</button><div class="cart-item-bottom"><div class="quantity-control"><button data-cart-qty="${product.id}" data-delta="-1" aria-label="Diminuir quantidade de ${product.name}">${icon('minus')}</button><output>${String(quantity).padStart(2, '0')}</output><button data-cart-qty="${product.id}" data-delta="1" aria-label="Aumentar quantidade de ${product.name}" ${quantity === 99 ? 'disabled' : ''}>${icon('plus')}</button></div><strong class="cart-line-price">${money(total)}</strong></div></div></article>`).join('') : `<div class="empty-state"><span>${icon('bag')}</span><h3>Sua sacola espera um carinho.</h3><p>Que tal escolher um buquê para começar?</p><button class="primary-button" data-action="continue-shopping">Explorar os buquês</button></div>`;
    $('#cart-footer').hidden = lines.length === 0;
    $('#cart-footer').innerHTML = lines.length ? `<div class="cart-summary-row"><span>Subtotal dos buquês</span><span>${money(cartTotal(state.cart))}</span></div><div class="cart-summary-row"><span>Entrega</span><span>A combinar</span></div><div class="cart-summary-row total"><span>Subtotal</span><span>${money(cartTotal(state.cart))}</span></div><button class="primary-button full-width" data-action="checkout">Continuar pedido ${icon('arrow-right')}</button><p class="cart-footer-note">Valores ilustrativos. Você está em uma loja de apresentação.</p>` : '';
  }
  function openCart() {
    $('#cart-title').textContent = 'Sua sacola';
    $('#cart-view').hidden = false; $('#checkout-view').hidden = true; $('#order-view').hidden = true;
    renderCart(); showDialog('cart-dialog');
  }
  function checkout() {
    if (!cartCount(state.cart)) return;
    $('#cart-title').textContent = 'Seu pedido';
    $('#cart-view').hidden = true; $('#checkout-view').hidden = false; $('#order-view').hidden = true;
    $('#cart-header-count').textContent = '';
    $('#checkout-total').textContent = money(cartTotal(state.cart));
    const now = new Date();
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    $('#delivery-date').min = localDate;
    $('#checkout-view').scrollTop = 0;
    $('#checkout-form [name="customer"]').focus();
  }
  function showOrder(event) {
    event.preventDefault();
    if (!cartCount(state.cart)) { openCart(); return; }
    const form = $('#checkout-form');
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const customer = String(data.get('customer')).trim();
    if (!customer) { form.elements.customer.setCustomValidity('Informe seu primeiro nome.'); form.elements.customer.reportValidity(); return; }
    const rawDate = String(data.get('date'));
    const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate.split('-').reverse().join('/') : rawDate;
    const delivery = String(data.get('delivery'));
    const message = String(data.get('message')).trim();
    const lines = cartLines(state.cart);
    state.orderText = `FLORÊ BUQUÊS — SIMULAÇÃO DE APRESENTAÇÃO\n\nNome: ${customer}\n${delivery}\nData desejada: ${date}\n\n${lines.map(line => `${line.quantity} × ${line.product.name} — ${money(line.total)}`).join('\n')}\n\nSubtotal: ${money(cartTotal(state.cart))}\nEntrega: a combinar\n${message ? `\nMensagem: ${message}\n` : ''}\nValores ilustrativos. Nenhum pedido foi enviado.`;
    $('#checkout-view').hidden = true; $('#order-view').hidden = false;
    $('#cart-title').textContent = 'Resumo do pedido';
    $('#order-view').innerHTML = `<div class="order-check">${icon('check')}</div><h3>Um pedido cheio de afeto.</h3><p>Assim ficaria o resumo do seu pedido.<br>Esta é uma simulação de apresentação.</p><div class="order-summary"><p><strong>${escapeHTML(customer)}</strong><br>${escapeHTML(delivery)}<br>Data desejada: ${escapeHTML(date)}</p><ul>${lines.map(line => `<li><span>${line.quantity} × ${line.product.name}</span><strong>${money(line.total)}</strong></li>`).join('')}</ul><div class="order-subtotal"><span>Subtotal</span><span>${money(cartTotal(state.cart))}</span></div>${message ? `<p style="margin-top:16px">Recadinho:<br>${escapeHTML(message)}</p>` : ''}</div><button class="primary-button full-width" data-action="copy-order">${icon('copy')} Copiar resumo</button><button class="text-link" data-action="continue-shopping">Continuar escolhendo flores</button><p class="checkout-demo">Nenhum pedido foi enviado. Nenhum pagamento foi realizado.</p>`;
    $('#order-view').scrollTop = 0;
  }
  async function copyOrder() {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(state.orderText);
      notify('Resumo copiado ♡');
    } catch {
      const area = document.createElement('textarea');
      area.value = state.orderText;
      area.setAttribute('aria-label', 'Resumo do pedido para copiar');
      area.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
      $('#cart-dialog').appendChild(area); area.focus(); area.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* Use the visible fallback below. */ }
      area.remove();
      if (copied) notify('Resumo copiado ♡');
      else {
        const visible = document.createElement('textarea');
        visible.value = state.orderText; visible.readOnly = true;
        visible.setAttribute('aria-label', 'Selecione e copie o resumo');
        visible.style.cssText = 'width:100%;height:180px;margin-top:15px;padding:12px;border:1px solid #ddc4ee;border-radius:12px;font:12px Arial';
        $('#order-view').appendChild(visible); visible.focus(); visible.select();
        notify('Selecione o resumo abaixo para copiar.');
      }
    }
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('button,a[data-view]');
    if (!target) return;
    if (target.dataset.close) { document.getElementById(target.dataset.close).close(); return; }
    if (target.dataset.view) { event.preventDefault(); setView(target.dataset.view); return; }
    if (target.dataset.category) {
      state.category = target.dataset.category; state.query = ''; state.view = 'catalog'; $('#search').value = ''; renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
    }
    if (target.dataset.product) { openProduct(target.dataset.product); return; }
    if (target.dataset.favorite || target.dataset.detailFavorite) { favorite(target.dataset.favorite || target.dataset.detailFavorite); return; }
    if (target.dataset.add) { addToCart(target.dataset.add); return; }
    if (target.dataset.detailQty) { changeDetailQuantity(Number(target.dataset.detailQty)); return; }
    if (target.dataset.remove) { delete state.cart[target.dataset.remove]; save(); renderCart(); return; }
    if (target.dataset.cartQty) {
      const id = target.dataset.cartQty;
      const quantity = store.clampQuantity((state.cart[id] || 0) + Number(target.dataset.delta));
      if (quantity) state.cart[id] = quantity; else delete state.cart[id];
      save(); renderCart(); return;
    }
    if (target.dataset.clear) {
      if (target.dataset.clear === 'query') { state.query = ''; $('#search').value = ''; }
      if (target.dataset.clear === 'category') state.category = 'all';
      if (target.dataset.clear === 'sort') state.sort = 'featured';
      renderProducts(); return;
    }
    const action = target.dataset.action;
    if (action === 'all') setView('catalog');
    if (action === 'about') showDialog('about-dialog');
    if (action === 'cart' || action === 'back-to-cart') openCart();
    if (action === 'search') { setView('catalog', false); window.scrollTo({ top: 0, behavior: 'smooth' }); $('#search').focus({ preventScroll: true }); }
    if (action === 'filters') {
      $('#filter-form [name="category"]').value = state.category;
      $('#filter-form [name="sort"]').value = state.sort;
      showDialog('filter-dialog');
    }
    if (action === 'add-detail') addToCart(state.currentProduct, state.detailQuantity);
    if (action === 'continue-shopping') { $('#cart-dialog').close(); setView('catalog'); }
    if (action === 'checkout') checkout();
    if (action === 'copy-order') copyOrder();
  });
  $('#search').addEventListener('input', event => { state.query = event.target.value.trim(); if (state.view === 'home') state.view = 'catalog'; renderProducts(); });
  $('#filter-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    state.category = String(data.get('category')); state.sort = String(data.get('sort'));
    if (state.view !== 'favorites') state.view = 'catalog';
    $('#filter-dialog').close(); renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#checkout-form').addEventListener('submit', showOrder);
  $('#checkout-form [name="customer"]').addEventListener('input', event => event.target.setCustomValidity(''));
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); $$('dialog[open]').forEach(dialog => dialog.close()); window.scrollTo({ top: 0 }); $('#search').focus();
    }
  });
  renderCategories(); renderSpecials(); renderProducts(); save();
})();
