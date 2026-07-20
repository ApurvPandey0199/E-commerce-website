// PR Manufacturing Co. - Main Common Script
// Injects Header, Footer, handles navigation, scroll effects, and widgets

document.addEventListener("DOMContentLoaded", () => {
  initSharedLayouts();
  updateCartBadge();
  updateAuthHeader();
  initMobileMenu();
  setupScrollEffects();
  injectWhatsAppWidget();
  
  window.addEventListener("cartUpdated", updateCartBadge);
  window.addEventListener("authChanged", () => {
    updateAuthHeader();
    updateCartBadge();
  });
});

// Sticky navigation scroll effect
function setupScrollEffects() {
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }
}

// Update Cart notification badge
function updateCartBadge() {
  const badge = document.getElementById("header-cart-badge");
  if (badge) {
    const summary = window.ShopifyService.getCartSummary();
    if (summary.count > 0) {
      badge.textContent = summary.count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }
}

// Update header UI according to user login state
function updateAuthHeader() {
  const authNav = document.getElementById("header-auth-nav");
  if (!authNav) return;

  const user = window.AuthService.getCurrentUser();
  if (user) {
    const isAdmin = window.AuthService.isAdmin();
    const displayName = user.contactPerson || user.companyName || user.email.split('@')[0];
    
    authNav.innerHTML = `
      <div class="user-dropdown">
        <button class="btn dropdown-toggle" id="user-drop-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span class="user-name-text">${displayName.split(' ')[0]}</span>
        </button>
        <div class="dropdown-menu" id="user-drop-menu">
          <a href="account.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> My Account</a>
          ${isAdmin ? `<a href="admin.html" class="admin-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="21" x2="9" y2="9"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg> Admin Dashboard</a>` : ''}
          <div class="dropdown-divider"></div>
          <button id="header-logout-btn" class="dropdown-item logout-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Log Out</button>
        </div>
      </div>
    `;

    const btn = document.getElementById("user-drop-btn");
    const menu = document.getElementById("user-drop-menu");
    if (btn && menu) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
      });
      document.addEventListener("click", () => {
        menu.classList.remove("show");
      });
    }

    const logoutBtn = document.getElementById("header-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        window.AuthService.logout();
        window.location.href = "index.html";
      });
    }
  } else {
    authNav.innerHTML = `
      <a href="auth.html" class="btn btn-secondary nav-login-btn btn-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        <span>Sign In</span>
      </a>
    `;
  }
}

// Mobile drawer controls
function initMobileMenu() {
  const burger = document.getElementById("mobile-menu-burger");
  const menu = document.getElementById("mobile-nav-links");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      menu.classList.toggle("active");
    });
  }
}

// Inject standard Header and Footer layouts
function initSharedLayouts() {
  const headerElem = document.getElementById("global-header");
  const footerElem = document.getElementById("global-footer");
  
  const currentPath = window.location.pathname.split("/").pop();

  if (headerElem) {
    headerElem.innerHTML = `
      <div class="header-container container">
        <a href="index.html" class="brand-logo">
          <div class="logo-badge">PR</div>
          <div class="brand-text-col">
            <span class="brand-name">PR Manufacturing</span>
            <span class="brand-sub">Co.</span>
          </div>
        </a>

        <!-- Hamburger Icon for Mobile -->
        <button class="menu-burger" id="mobile-menu-burger" aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="nav-menu" id="mobile-nav-links">
          <ul class="nav-links">
            <li><a href="index.html" class="${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Home</a></li>
            <li><a href="shop.html" class="${currentPath === 'shop.html' || currentPath === 'catalog.html' ? 'active' : ''}">Shop</a></li>
            <li><a href="about.html" class="${currentPath === 'about.html' ? 'active' : ''}">About</a></li>
            <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <a href="cart.html" class="cart-trigger" aria-label="View Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span class="cart-badge" id="header-cart-badge" style="display:none;">0</span>
          </a>
          <span id="header-auth-nav"></span>
        </div>
      </div>
    `;
  }

  if (footerElem) {
    footerElem.innerHTML = `
      <div class="footer-top container">
        <div class="footer-brand-col">
          <a href="index.html" class="brand-logo">
            <div class="logo-badge">PR</div>
            <div class="brand-text-col">
              <span class="brand-name">PR Manufacturing</span>
              <span class="brand-sub">Co.</span>
            </div>
          </a>
          <p class="footer-desc">Direct factory manufacturer specializing in corporate t-shirts, custom pique polos, team hoodies, medical scrubs, and promotional gifts. Premium quality, quick fulfillment.</p>
          <div class="footer-contacts">
            <p><strong>Factory Address:</strong> PR Complex, Sector 4, Industrial Area, Mumbai, MH - 400001</p>
            <p><strong>Email:</strong> info@prmfg.com</p>
            <p><strong>Support Hotline:</strong> +91 99999 88888</p>
          </div>
        </div>
        
        <div class="footer-links-col">
          <h3>Categories</h3>
          <ul>
            <li><a href="category.html?slug=t-shirts">Corporate T-Shirts</a></li>
            <li><a href="category.html?slug=polos">Signature Polos</a></li>
            <li><a href="category.html?slug=hoodies">Team Hoodies</a></li>
            <li><a href="category.html?slug=uniforms">Uniform Sets</a></li>
            <li><a href="category.html?slug=gifts">Promotional Gifts</a></li>
          </ul>
        </div>
        
        <div class="footer-links-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="shop.html">Browse All Products</a></li>
            <li><a href="cart.html">View Shopping Cart</a></li>
            <li><a href="account.html">My Account</a></li>
            <li><a href="auth.html">Customer Sign In</a></li>
          </ul>
        </div>

        <div class="footer-links-col">
          <h3>Company</h3>
          <ul>
            <li><a href="about.html">About PR Manufacturing</a></li>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="policies.html?tab=terms">Terms & Conditions</a></li>
            <li><a href="policies.html?tab=privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-container">
          <p>&copy; 2026 PR Manufacturing Co. All Rights Reserved.</p>
          <div class="footer-payment-badges">
            <span>Cash on Delivery</span>
            <span>UPI Instant</span>
            <span>Cards</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Inject Floating WhatsApp Support button
function injectWhatsAppWidget() {
  if (document.querySelector(".whatsapp-floating-widget")) return;
  const container = document.createElement("div");
  container.className = "whatsapp-floating-widget";
  container.innerHTML = `
    <a href="https://wa.me/919999988888?text=Hello%20PR%20Manufacturing%20Co.,%20I%20have%20an%20inquiry%20regarding%20products." target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.37 5.378 0 12.003 0c3.21.002 6.225 1.251 8.49 3.52 2.264 2.27 3.508 5.287 3.504 8.497-.006 6.628-5.382 12-12.007 12-1.996-.001-3.957-.5-5.708-1.448L0 24zm6.59-15.02c-.116-.257-.238-.262-.45-.27-.17-.008-.364-.01-.557-.01-.193 0-.508.073-.773.364-.265.291-1.01.987-1.01 2.408s1.033 2.79 1.178 2.985c.145.195 2.033 3.103 4.925 4.35 2.41 1.04 2.9.833 3.425.784.525-.049 1.691-.69 1.932-1.357.242-.667.242-1.241.17-1.357-.072-.116-.265-.188-.558-.334-.292-.146-1.722-.849-1.99-.947-.267-.097-.46-.146-.656.146-.195.292-.756.947-.925 1.142-.17.195-.339.219-.633.073-.292-.146-1.237-.456-2.355-1.453-.872-.777-1.46-1.737-1.631-2.03-.17-.291-.018-.449.128-.594.132-.131.292-.339.44-.509.146-.17.194-.292.292-.486.097-.195.048-.364-.024-.51-.073-.146-.656-1.579-.902-2.175z"/>
      </svg>
      <span>Chat with us</span>
    </a>
  `;
  document.body.appendChild(container);
}
