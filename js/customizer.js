// Product Details and Customizer Page Script

let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let uploadedLogoData = null;
let uploadedLogoName = "";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "prod-classic-crew";
  
  currentProduct = window.PR_DB.getProductById(productId);
  if (!currentProduct) {
    document.getElementById("product-detail-container").innerHTML = `
      <div class="container text-center" style="padding: 100px 20px;">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist in our catalog.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
    return;
  }

  // Set default configurations
  selectedColor = currentProduct.colors ? currentProduct.colors[0] : { name: "Navy", hex: "#0A2540" };
  selectedSize = currentProduct.sizes ? currentProduct.sizes[0] : "L";
  
  renderProductDetails();
  renderSpecsTable();
  renderReviews();
  renderRelatedProducts();
  initCustomizerEvents();
  recalculatePricing();
});

// Render Product fields to UI
function renderProductDetails() {
  document.title = `${currentProduct.name} - PR Manufacturing Co.`;
  
  document.getElementById("prod-name").textContent = currentProduct.name;
  document.getElementById("prod-tagline").textContent = currentProduct.tagline;
  document.getElementById("prod-desc").textContent = currentProduct.description;
  document.getElementById("prod-moq").textContent = `Min ${currentProduct.moq || 30} Pcs`;
  document.getElementById("prod-category-badge").textContent = (currentProduct.category || "Apparel").toUpperCase();
  document.getElementById("prod-rating-val").textContent = currentProduct.rating || "4.8";
  document.getElementById("prod-reviews-count-lbl").textContent = `(${currentProduct.reviews_count || 0} reviews)`;

  // Pricing Tiers Table
  const tierContainer = document.getElementById("prod-pricing-tiers");
  tierContainer.innerHTML = currentProduct.priceTiers.map((tier, idx, arr) => {
    let quantityRange = idx === arr.length - 1 ? `${tier.minQty}+ pcs` : `${tier.minQty} - ${arr[idx+1].minQty - 1} pcs`;
    return `
      <div class="tier-card">
        <span class="tier-qty">${quantityRange}</span>
        <span class="tier-price">₹${tier.price}/pc</span>
      </div>
    `;
  }).join('');

  // Color Swatches
  const colorContainer = document.getElementById("color-swatches");
  colorContainer.innerHTML = currentProduct.colors.map((color, idx) => `
    <button class="color-swatch-btn ${idx === 0 ? 'active' : ''}" 
            style="background-color: ${color.hex};" 
            title="${color.name}"
            data-color-name="${color.name}"
            data-color-hex="${color.hex}">
    </button>
  `).join('');
  document.getElementById("selected-color-name").textContent = selectedColor.name;

  // Sizing Selector
  const sizeContainer = document.getElementById("size-selectors");
  sizeContainer.innerHTML = currentProduct.sizes.map((size, idx) => `
    <button class="size-selector-btn ${idx === 0 ? 'active' : ''}" 
            data-size="${size}">
      ${size}
    </button>
  `).join('');

  const qtyInput = document.getElementById("order-qty");
  qtyInput.value = currentProduct.moq || 30;
  qtyInput.min = currentProduct.moq || 30;
  
  drawMockupCanvas();
}

// Render Specs Table
function renderSpecsTable() {
  const table = document.getElementById("prod-specs-table");
  if (!table || !currentProduct.specs) return;

  const entries = Object.entries(currentProduct.specs);
  table.innerHTML = entries.map(([key, val]) => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 6px 0; font-weight: 600; color: var(--text-muted);">${key}:</td>
      <td style="padding: 6px 0; text-align: right; color: var(--text-main); font-weight: 500;">${val}</td>
    </tr>
  `).join('');
}

// Render Reviews Section
function renderReviews() {
  const container = document.getElementById("reviews-list-container");
  if (!container) return;

  const reviews = currentProduct.reviews || [];
  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="grid-column: 1/-1; padding: 30px; background: var(--bg-white); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
        <p class="text-muted">No reviews yet for this product. Be the first to share feedback!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map(rev => `
    <div style="background: var(--bg-white); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong>${rev.user_name}</strong>
        <span style="font-size: 12px; color: var(--text-muted);">${rev.date}</span>
      </div>
      <div class="star-rating" style="margin-bottom: 8px;">${"★".repeat(rev.rating)}</div>
      <p style="font-size: 14px; color: var(--text-muted);">${rev.comment}</p>
    </div>
  `).join('');
}

// Related Products
function renderRelatedProducts() {
  const container = document.getElementById("related-products-grid");
  if (!container) return;

  const allProducts = window.PR_DB.getProducts();
  const related = allProducts.filter(p => p.id !== currentProduct.id).slice(0, 3);

  container.innerHTML = related.map(p => `
    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="cursor: pointer;">
      <div class="product-img-box">
        <img src="${p.images[0]}" alt="${p.name}">
        <span class="category-badge">${p.category}</span>
      </div>
      <div class="product-info-box">
        <h3>${p.name}</h3>
        <p class="product-tagline">${p.tagline}</p>
        <div class="product-footer-row">
          <div>
            <span class="product-price-lbl">Starting at</span>
            <div class="product-price-val">₹${p.basePrice}</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.location.href='product.html?id=${p.id}';">View</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Event Listeners setup
function initCustomizerEvents() {
  // Swatches click
  document.getElementById("color-swatches").addEventListener("click", (e) => {
    const btn = e.target.closest(".color-swatch-btn");
    if (btn) {
      document.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedColor = {
        name: btn.getAttribute("data-color-name"),
        hex: btn.getAttribute("data-color-hex")
      };
      document.getElementById("selected-color-name").textContent = selectedColor.name;
      drawMockupCanvas();
    }
  });

  // Size click
  document.getElementById("size-selectors").addEventListener("click", (e) => {
    const btn = e.target.closest(".size-selector-btn");
    if (btn) {
      document.querySelectorAll(".size-selector-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.getAttribute("data-size");
    }
  });

  // Print method change
  document.getElementById("print-method").addEventListener("change", () => {
    recalculatePricing();
    drawMockupCanvas();
  });

  // Quantity Controls
  document.getElementById("qty-minus").addEventListener("click", () => {
    const input = document.getElementById("order-qty");
    let val = parseInt(input.value) || currentProduct.moq;
    if (val > 1) {
      input.value = val - 1;
      recalculatePricing();
    }
  });

  document.getElementById("qty-plus").addEventListener("click", () => {
    const input = document.getElementById("order-qty");
    let val = parseInt(input.value) || currentProduct.moq;
    input.value = val + 1;
    recalculatePricing();
  });

  document.getElementById("order-qty").addEventListener("input", recalculatePricing);

  // Logo upload
  const fileInput = document.getElementById("logo-file-input");
  const uploadZone = document.getElementById("logo-upload-zone");
  if (uploadZone && fileInput) {
    uploadZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        uploadedLogoName = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedLogoData = event.target.result;
          document.getElementById("upload-box-content").innerHTML = `
            <div style="color: #10B981; font-weight: 600;">
              ✓ ${file.name} Uploaded
            </div>
          `;
          drawMockupCanvas();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Add to Cart handler
  document.getElementById("btn-add-to-cart").addEventListener("click", () => {
    addToCartAction();
    showCartSuccessModal();
  });

  // Buy Now handler
  document.getElementById("btn-buy-now").addEventListener("click", () => {
    addToCartAction();
    window.location.href = "checkout.html";
  });

  // Review Form toggle & submit
  const openRevBtn = document.getElementById("btn-open-review-form");
  const revPanel = document.getElementById("review-form-panel");
  if (openRevBtn && revPanel) {
    openRevBtn.addEventListener("click", () => {
      revPanel.style.display = revPanel.style.display === "none" ? "block" : "none";
    });

    document.getElementById("submit-review-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("rev-author").value;
      const rating = parseInt(document.getElementById("rev-rating").value);
      const comment = document.getElementById("rev-comment").value;

      const newReview = {
        id: "rev-" + Date.now(),
        user_name: name,
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split("T")[0]
      };

      window.PR_DB.addReview(currentProduct.id, newReview);
      currentProduct = window.PR_DB.getProductById(currentProduct.id);
      renderReviews();
      renderProductDetails();
      revPanel.style.display = "none";
      document.getElementById("submit-review-form").reset();
    });
  }
}

function addToCartAction() {
  const qty = parseInt(document.getElementById("order-qty").value) || currentProduct.moq || 30;
  const printMethod = document.getElementById("print-method").value;
  const printPlacement = document.getElementById("print-placement").value;
  
  const cartItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    category: currentProduct.category,
    color: selectedColor.name,
    size: selectedSize,
    qty: qty,
    price: currentProduct.basePrice,
    image: currentProduct.images[0],
    customization: {
      method: printMethod,
      placement: printPlacement,
      logoName: uploadedLogoName,
      logoData: uploadedLogoData
    }
  };

  window.ShopifyService.addToCart(cartItem);
}

// Recalculate price tiers
function recalculatePricing() {
  const qtyInput = document.getElementById("order-qty");
  let qty = parseInt(qtyInput.value) || currentProduct.moq || 30;
  
  const printMethod = document.getElementById("print-method").value;
  let unitPrice = window.ShopifyService.calculateUnitPrice(currentProduct.id, qty, printMethod);

  let addon = 0;
  if (printMethod === "Screen Print") addon = 20;
  else if (printMethod === "Embroidery") addon = 45;
  else if (printMethod === "DTG Print") addon = 35;

  const finalUnitPrice = unitPrice + addon;
  const total = finalUnitPrice * qty;

  document.getElementById("calc-unit-price").textContent = `₹${finalUnitPrice}/pc`;
  document.getElementById("calc-total-price").textContent = `₹${total.toLocaleString()}`;
}

// Canvas Visualizer Drawing
function drawMockupCanvas() {
  const canvas = document.getElementById("canvas-mockup");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  canvas.width = 380;
  canvas.height = 380;
  ctx.clearRect(0, 0, 380, 380);

  const apparelColor = selectedColor ? selectedColor.hex : "#0A2540";
  ctx.fillStyle = apparelColor;

  // Draw Garment Silhouette
  ctx.beginPath();
  ctx.moveTo(100, 70);
  ctx.lineTo(140, 50);
  ctx.quadraticCurveTo(190, 75, 240, 50);
  ctx.lineTo(280, 70);
  ctx.lineTo(340, 140);
  ctx.lineTo(300, 180);
  ctx.lineTo(270, 150);
  ctx.lineTo(270, 340);
  ctx.lineTo(110, 340);
  ctx.lineTo(110, 150);
  ctx.lineTo(80, 180);
  ctx.lineTo(40, 140);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw Logo artwork if uploaded
  if (uploadedLogoData) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 150, 140, 80, 80);
    };
    img.src = uploadedLogoData;
  }
}

function showCartSuccessModal() {
  const modal = document.createElement("div");
  modal.className = "custom-modal-backdrop";
  modal.innerHTML = `
    <div class="custom-modal-box">
      <div class="modal-success-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h2>Added to Cart!</h2>
      <p>Your item <strong>${currentProduct.name}</strong> has been added successfully.</p>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-continue">Continue Shopping</button>
        <a href="cart.html" class="btn btn-primary">Go to Cart</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.getElementById("modal-continue").addEventListener("click", () => {
    modal.remove();
  });
}
