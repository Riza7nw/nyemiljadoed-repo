/* ============================================
   NYEMIL JADOEL - Main Script
   ============================================ */

(function () {
  'use strict';

  // ---------- State ----------
  let cart = JSON.parse(localStorage.getItem('nyemiljadoel_cart') || '[]');
  let wishlist = JSON.parse(localStorage.getItem('nyemiljadoel_wishlist') || '[]');

  const products = [
  { id: 2, name: 'Dadar Gulung', price: 3500, category: 'snack', img: 'dadargulung2.jpg' },
  { id: 3, name: 'Sosis Solo', price: 4000, category: 'snack', img: 'sosissolo.jpg' },
  { id: 4, name: 'Kue Putu', price: 8000, category: 'kue', img: 'kueputu.jpg' },
  { id: 5, name: 'Badeg', price: 6000, category: 'minuman', img: 'badeg.png' },
  { id: 6, name: 'Klepon', price: 5000, category: 'snack', img: 'klepon2.jpg' },

  // produk baru
  { id: 7, name: 'Onde-onde', price: 5000, category: 'kue', img: 'ondeonde.jpg' },
  { id: 8, name: 'Lemper Ayam', price: 5000, category: 'snack', img: 'lemper.jpg' },
  { id: 9, name: 'Es Cendol', price: 7000, category: 'minuman', img: 'cendol.jpg' }
];

  // Bersihkan data lama (kalau sebelumnya ada produk permen id=1)
  cart = cart.filter(item => item.id !== 1);
  wishlist = wishlist.filter(id => id !== 1);

  // ---------- DOM Refs ----------
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  const cartItemsEl = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');
  const cartTotalText = document.getElementById('cart-total-text');
  const cartBadge = document.getElementById('cart-badge');
  const wishlistSidebar = document.getElementById('wishlist-sidebar');
  const wishlistToggle = document.getElementById('wishlist-toggle');
  const wishlistClose = document.getElementById('wishlist-close');
  const wishlistItemsEl = document.getElementById('wishlist-items');
  const wishlistEmpty = document.getElementById('wishlist-empty');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutClose = document.getElementById('checkout-close');
  const btnCheckout = document.getElementById('btn-checkout');
  const checkoutSummary = document.getElementById('checkout-summary');
  const checkoutForm = document.getElementById('checkout-form');
  const popupDiskon = document.getElementById('popup-diskon');
  const popupCloseBtn = document.querySelector('.popup-close');
  const popupCta = document.querySelector('.popup-cta');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  const themeToggle = document.getElementById('theme-toggle');
  const countdownHours = document.getElementById('hours');
  const countdownMinutes = document.getElementById('minutes');
  const countdownSeconds = document.getElementById('seconds');
  const newsletterForm = document.getElementById('newsletter-form');
  const recommendationsGrid = document.getElementById('recommendations-grid');

  // ---------- Helpers ----------
  function saveCart() {
    localStorage.setItem('nyemiljadoel_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('nyemiljadoel_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
  }

  function formatRupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  // ---------- Theme ----------
  function initTheme() {
    const saved = localStorage.getItem('nyemiljadoel_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nyemiljadoel_theme', next);
    });
  }

  // ---------- Cart ----------
  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function addToCart(id, name, price, img) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      const product = products.find(p => p.id === id);
      cart.push({
        id,
        name,
        price,
        qty: 1,
        img: product ? product.img : ''
      });
    }
    saveCart();
    if (cartSidebar) cartSidebar.classList.add('active');
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
  }

  function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else saveCart();
  }

  function updateCartUI() {
    const total = cart.length;
    if (cartBadge) cartBadge.textContent = total;

    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartEmpty.hidden = false;
      cartSummary.hidden = true;
      return;
    }
    cartEmpty.hidden = true;
    cartSummary.hidden = false;
    cartTotalText.textContent = formatRupiah(getCartTotal());

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)} × ${item.qty}</div>
          <div class="cart-item-actions">
            <button type="button" class="btn btn-sm qty-minus" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button type="button" class="btn btn-sm qty-plus" data-id="${item.id}">+</button>
            <button type="button" class="btn btn-sm btn-remove" data-id="${item.id}">Hapus</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });

    cartItemsEl.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => updateCartQty(Number(btn.dataset.id), -1));
    });
    cartItemsEl.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => updateCartQty(Number(btn.dataset.id), 1));
    });
    cartItemsEl.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
    });
  }

  cartToggle && cartToggle.addEventListener('click', () => {
    cartSidebar.classList.toggle('active');
    if (wishlistSidebar) wishlistSidebar.classList.remove('active');
  });
  cartClose && cartClose.addEventListener('click', () => cartSidebar.classList.remove('active'));

  // ---------- Wishlist ----------
  function toggleWishlist(id) {
    const idx = wishlist.indexOf(id);
    if (idx === -1) wishlist.push(id);
    else wishlist.splice(idx, 1);
    saveWishlist();
  }

  function isInWishlist(id) {
    return wishlist.includes(id);
  }

  function updateWishlistUI() {
    if (wishlistBadge) wishlistBadge.textContent = wishlist.length;

    if (!wishlistItemsEl) return;
    wishlistItemsEl.innerHTML = '';
    if (wishlist.length === 0) {
      wishlistEmpty.hidden = false;
      return;
    }
    wishlistEmpty.hidden = true;
    wishlist.forEach(pid => {
      const product = products.find(p => p.id === pid);
      if (!product) return;
      const li = document.createElement('li');
      li.className = 'wishlist-item';
      li.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${product.name}</div>
          <div class="cart-item-price">${formatRupiah(product.price)}</div>
          <button type="button" class="btn btn-sm btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Tambah ke Keranjang</button>
          <button type="button" class="btn btn-sm wishlist-remove" data-id="${product.id}">Hapus</button>
        </div>
      `;
      wishlistItemsEl.appendChild(li);
    });
    wishlistItemsEl.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(Number(btn.dataset.id), btn.dataset.name, Number(btn.dataset.price), '');
      });
    });
    wishlistItemsEl.querySelectorAll('.wishlist-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleWishlist(Number(btn.dataset.id));
      });
    });
  }

  wishlistToggle && wishlistToggle.addEventListener('click', () => {
    wishlistSidebar.classList.toggle('active');
    if (cartSidebar) cartSidebar.classList.remove('active');
  });
  wishlistClose && wishlistClose.addEventListener('click', () => wishlistSidebar.classList.remove('active'));

  // Add to cart / wishlist from product cards
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = Number(this.dataset.id);
      const name = this.dataset.name;
      const price = Number(this.dataset.price);
      const product = products.find(p => p.id === id);
      addToCart(id, name, price, product ? product.img : '');
    });
  });
  document.querySelectorAll('.wishlist-add').forEach(btn => {
    btn.addEventListener('click', function () {
      toggleWishlist(Number(this.dataset.id));
      this.classList.toggle('active', isInWishlist(Number(this.dataset.id)));
    });
  });

  // ---------- Checkout ----------
  function openCheckout() {
    if (cart.length === 0) return;
    let html = '<strong>Ringkasan:</strong><ul style="margin-top:0.5rem; padding-left:1.2rem;">';
    cart.forEach(item => {
      html += `<li>${item.name} × ${item.qty} = ${formatRupiah(item.price * item.qty)}</li>`;
    });
    html += `</ul><p style="margin-top:0.5rem;"><strong>Total: ${formatRupiah(getCartTotal())}</strong></p>`;
    checkoutSummary.innerHTML = html;
    checkoutModal.classList.add('active');
  }

  btnCheckout && btnCheckout.addEventListener('click', (e) => {
    e.preventDefault();
    openCheckout();
  });
  checkoutClose && checkoutClose.addEventListener('click', () => checkoutModal.classList.remove('active'));
  checkoutModal && checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('active');
  });

  checkoutForm && checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Simulasi: tampilkan alert dan kosongkan keranjang
    const formData = new FormData(this);
    const name = formData.get('name');
    alert('Terima kasih, ' + name + '! Ini simulasi pembayaran. Pesanan kamu akan diproses setelah pembayaran nyata.');
    cart = [];
    saveCart();
    checkoutModal.classList.remove('active');
    this.reset();
  });

  // ---------- Popup Diskon ----------
  function showPopupIfFirstVisit() {
    if (localStorage.getItem('nyemiljadoel_popup_seen')) return;
    setTimeout(() => {
      popupDiskon.classList.add('active');
      popupDiskon.setAttribute('aria-hidden', 'false');
    }, 800);
  }

  function closePopup() {
    popupDiskon.classList.remove('active');
    popupDiskon.setAttribute('aria-hidden', 'true');
    localStorage.setItem('nyemiljadoel_popup_seen', '1');
  }

  popupCloseBtn && popupCloseBtn.addEventListener('click', closePopup);
  popupCta && popupCta.addEventListener('click', () => {
    closePopup();
    document.querySelector('#produk') && document.querySelector('#produk').scrollIntoView({ behavior: 'smooth' });
  });
  popupDiskon && popupDiskon.addEventListener('click', (e) => {
    if (e.target === popupDiskon) closePopup();
  });

  // ---------- Countdown ----------
  function runCountdown() {
    let total = 2 * 3600 + 14 * 60 + 21; // 2h 14m 21s
    function tick() {
      if (total <= 0) {
        total = 24 * 3600; // reset ke 24 jam
      }
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      if (countdownHours) countdownHours.textContent = String(h).padStart(2, '0');
      if (countdownMinutes) countdownMinutes.textContent = String(m).padStart(2, '0');
      if (countdownSeconds) countdownSeconds.textContent = String(s).padStart(2, '0');
      total--;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Filter Kategori ----------
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        const cat = card.dataset.category;
        card.classList.toggle('hidden', filter !== 'all' && cat !== filter);
      });
    });
  });

  // ---------- Scroll Reveal ----------
  function initScrollReveal() {
    const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, options);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ---------- Newsletter (simpan ke MySQL via subscribe.php) ----------
  newsletterForm && newsletterForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (window.location.protocol === 'file:') {
      const statusEarly = document.getElementById('newsletter-status');
      if (statusEarly) {
        statusEarly.textContent =
          'Newsletter butuh PHP + MySQL. Buka dari Laragon: http://localhost/webnyemiljadoel/ (jangan buka file .html dua kali / drag ke browser).';
        statusEarly.className = 'newsletter-status newsletter-status--error';
      }
      return;
    }
    const emailInput = this.querySelector('input[name="email"]');
    const email = emailInput && emailInput.value ? emailInput.value.trim() : '';
    const statusEl = document.getElementById('newsletter-status');
    const submitBtn = document.getElementById('newsletter-submit');

    if (!email) {
      if (statusEl) {
        statusEl.textContent = 'Isi alamat email dulu ya.';
        statusEl.className = 'newsletter-status newsletter-status--error';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
    }
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'newsletter-status';
    }

    try {
      const subscribeUrl = new URL('subscribe.php', window.location.href).href;
      const res = await fetch(subscribeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        const looksHtml = /^\s*</.test(text);
        data = {
          ok: false,
          message: looksHtml
            ? 'Respons bukan JSON (biasanya halaman error atau bukan PHP). Pastikan Apache + PHP menyala di Laragon dan URL seperti http://localhost/webnyemiljadoel/ — bukan Live Server atau file:/// .'
            : 'Server tidak mengembalikan data valid. Buka lewat Apache + PHP (http://localhost/.../project/) supaya subscribe.php bisa dijalankan.'
        };
      }

      const ok = data.ok === true;
      if (statusEl) {
        statusEl.textContent =
          data.message ||
          (ok ? 'Berhasil tersimpan.' : 'Gagal menyimpan email. Cek database & XAMPP.');
        statusEl.className = 'newsletter-status ' + (ok ? 'newsletter-status--ok' : 'newsletter-status--error');
      }

      if (ok) {
        this.reset();
      }
    } catch (err) {
      if (statusEl) {
        statusEl.textContent =
          'Tidak bisa terhubung ke server. Pastikan XAMPP/WAMP menyala dan alamat benar (bukan file:///).';
        statusEl.className = 'newsletter-status newsletter-status--error';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Sekarang';
      }
    }
  });

  // ---------- Recommendations (sederhana: 2–3 produk random) ----------
  function renderRecommendations() {
    if (!recommendationsGrid) return;
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const slice = shuffled.slice(0, 3);
    recommendationsGrid.innerHTML = slice.map(p => `
      <div class="recommendation-card">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <strong>${p.name}</strong>
          <p class="cart-item-price">${formatRupiah(p.price)}</p>
          <button type="button" class="btn btn-sm btn-add-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Tambah</button>
        </div>
      </div>
    `).join('');
    recommendationsGrid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        addToCart(Number(this.dataset.id), this.dataset.name, Number(this.dataset.price), '');
      });
    });
  }

  // ---------- Hamburger ----------
  hamburger && hamburger.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    mainNav.classList.toggle('active');
  });
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
      }
    });
  });

  // ---------- Loading overlay (permen berputar) ----------
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
    }, 1500);
  }

  // ---------- Init ----------
  initTheme();
  updateCartUI();
  updateWishlistUI();
  runCountdown();
  initScrollReveal();
  renderRecommendations();
  showPopupIfFirstVisit();
  // ---------- Multi Language ----------
const translations = {
  id: {
    heroTitle: "Rasa Lama, Kenangan Tak Pernah Usang 🍪",
    heroSubtitle: "Jajanan legendaris Indonesia yang bikin kamu balik ke masa kecil.",
    shopNow: "Belanja Sekarang",
    seeMenu: "Lihat Menu Jadul"
  },

  en: {
    heroTitle: "Old Taste, Timeless Memories 🍪",
    heroSubtitle: "Legendary Indonesian snacks that bring back childhood memories.",
    shopNow: "Shop Now",
    seeMenu: "See Nostalgic Menu"
  }
};

const languageSelect = document.getElementById('language-select');

function changeLanguage(lang) {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    el.textContent = translations[lang][key];
  });

  localStorage.setItem('nyemiljadoel_language', lang);
}

if (languageSelect) {
  const savedLang = localStorage.getItem('nyemiljadoel_language') || 'id';

  languageSelect.value = savedLang;
  changeLanguage(savedLang);

  languageSelect.addEventListener('change', function () {
    changeLanguage(this.value);
  });
}
  // Set initial wishlist heart state on product cards
  document.querySelectorAll('.wishlist-add').forEach(btn => {
    btn.classList.toggle('active', isInWishlist(Number(btn.dataset.id)));
  });
})();
