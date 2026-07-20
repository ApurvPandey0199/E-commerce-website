// PR Manufacturing Co. - Admin Dashboard Management Script

document.addEventListener("DOMContentLoaded", () => {
  if (!window.AuthService.isAdmin()) {
    showAdminAccessDenied();
    return;
  }

  renderStats();
  renderOrdersList();
  renderProductsList();
  renderCategoriesList();
  renderCustomersList();
  setupAdminTabControls();
  setupModals();
});

// Guard
function showAdminAccessDenied() {
  const container = document.getElementById("admin-dashboard-container");
  if (!container) return;
  container.innerHTML = `
    <div class="container text-center" style="padding: 100px 20px;">
      <div style="font-size: 54px; color: #EF4444; margin-bottom: 15px;">⚠️</div>
      <h2 style="font-size: 26px; font-weight: 700; margin-bottom: 10px;">Restricted Access</h2>
      <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 25px;">
        This console requires administrator credentials. Please sign in with an admin account (e.g. <code>admin@prmfg.com</code>).
      </p>
      <a href="auth.html" class="btn btn-primary">Go to Login</a>
    </div>
  `;
}

// Stats Overview
function renderStats() {
  const orders = window.PR_DB.getOrders();
  const products = window.PR_DB.getProducts();
  const users = window.PR_DB.getUsers();
  
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  document.getElementById("stat-sales").textContent = `₹${totalSales.toLocaleString()}`;
  document.getElementById("stat-orders").textContent = orders.length;
  document.getElementById("stat-customers").textContent = users.length;
  document.getElementById("stat-products").textContent = products.length;
}

// Tab Switching
function setupAdminTabControls() {
  const tabs = document.querySelectorAll(".admin-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const targetSec = tab.getAttribute("data-target");
      document.querySelectorAll(".admin-section").forEach(sec => {
        sec.style.display = "none";
      });
      document.getElementById(targetSec).style.display = "block";
    });
  });
}

// Render Orders List with Status Switcher
function renderOrdersList() {
  const orders = window.PR_DB.getOrders();
  const tableBody = document.getElementById("admin-orders-table-body");
  if (!tableBody) return;

  if (orders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 30px;">No orders found in queue.</td></tr>`;
    return;
  }

  tableBody.innerHTML = orders.map(order => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 12px;"><strong>${order.id}</strong></td>
      <td style="padding: 12px;">${order.userEmail}</td>
      <td style="padding: 12px;">${order.date}</td>
      <td style="padding: 12px; font-weight: 700; color: var(--accent);">₹${order.total.toLocaleString()}</td>
      <td style="padding: 12px;">
        <select class="form-control status-select-btn" data-order-id="${order.id}" style="padding: 6px 10px; font-size: 13px; width: 150px;">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="In Production" ${order.status === 'In Production' ? 'selected' : ''}>In Production</option>
          <option value="Shipped" ${order.status === 'Shipped' || order.status === 'Dispatched' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
      <td style="padding: 12px; text-align: right;">
        <a href="order.html?id=${order.id}" class="btn btn-secondary btn-sm" target="_blank">View Receipt</a>
      </td>
    </tr>
  `).join('');

  // Attach status change events
  document.querySelectorAll(".status-select-btn").forEach(select => {
    select.addEventListener("change", (e) => {
      const orderId = select.getAttribute("data-order-id");
      const newStatus = e.target.value;
      window.PR_DB.updateOrderStatus(orderId, newStatus);
      showAdminNotification(`Order ${orderId} updated to status: ${newStatus}`);
      renderStats();
    });
  });
}

// Render Products Management List
function renderProductsList() {
  const products = window.PR_DB.getProducts();
  const container = document.getElementById("admin-products-grid");
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div style="background: var(--bg-white); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <img src="${p.images[0]}" alt="${p.name}" style="height: 140px; width: 100%; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 12px;">
        <h4 style="font-size: 15px; margin-bottom: 4px;">${p.name}</h4>
        <span class="category-badge" style="font-size: 10px;">${p.category}</span>
        <div style="margin-top: 10px; font-size: 14px;">
          <span>Base Price: <strong>₹${p.basePrice}</strong></span> | 
          <span>Stock: <strong>${p.stock || 500}</strong></span>
        </div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 15px;">
        <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="editProductPrompt('${p.id}')">Edit</button>
        <button class="btn btn-outline btn-sm" style="color: #EF4444; border-color: #EF4444;" onclick="deleteProductAction('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Render Categories List
function renderCategoriesList() {
  const categories = window.PR_DB.getCategories();
  const container = document.getElementById("admin-categories-grid");
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div style="background: var(--bg-white); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
      <h4 style="font-size: 16px; margin-bottom: 6px;">${cat.name}</h4>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Slug: <code>${cat.slug}</code></p>
      <p style="font-size: 13px; color: var(--text-main);">${cat.description}</p>
    </div>
  `).join('');
}

// Render Customers List
function renderCustomersList() {
  const users = window.PR_DB.getUsers();
  const tbody = document.getElementById("admin-customers-table-body");
  if (!tbody) return;

  tbody.innerHTML = users.map(u => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 12px;"><strong>${u.contactPerson || u.companyName}</strong></td>
      <td style="padding: 12px;">${u.companyName || '-'}</td>
      <td style="padding: 12px;">${u.email}</td>
      <td style="padding: 12px;">${u.phone || '-'}</td>
      <td style="padding: 12px;"><span class="category-badge" style="background: ${u.role === 'admin' ? 'var(--accent)' : 'var(--primary)'}; color: #FFF;">${u.role || 'customer'}</span></td>
    </tr>
  `).join('');
}

// CRUD Modals and Actions
function setupModals() {
  // Add Product Modal
  document.getElementById("btn-add-product-modal").addEventListener("click", () => {
    const name = prompt("Enter Product Title:");
    if (!name) return;
    const price = parseFloat(prompt("Enter Base Price in INR (e.g. 399):", "399"));
    if (!price) return;

    const newProd = {
      id: "prod-" + Date.now(),
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: "t-shirts",
      category_id: "cat-tshirts",
      tagline: "High Durability Apparel",
      description: "Direct factory manufactured apparel with customizable colors and sizes.",
      basePrice: price,
      stock: 1000,
      moq: 30,
      rating: 5.0,
      reviews_count: 1,
      images: ["img/product-tshirt-1.png"],
      colors: [{ name: "Navy Blue", hex: "#0A2540" }],
      sizes: ["S", "M", "L", "XL"],
      fabric: "180 GSM Bio-Washed Cotton",
      specs: { "GSM Weight": "180 GSM", "Blend": "100% Cotton" },
      priceTiers: [{ minQty: 30, price: price }]
    };

    window.PR_DB.addProduct(newProd);
    showAdminNotification("New Product Added Successfully!");
    renderProductsList();
    renderStats();
  });

  // Add Category Modal
  document.getElementById("btn-add-category-modal").addEventListener("click", () => {
    const name = prompt("Enter Category Name:");
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const desc = prompt("Enter Category Short Description:", "Direct factory custom apparel.");

    const newCat = {
      id: "cat-" + Date.now(),
      name: name,
      slug: slug,
      image: "img/product-tshirt-1.png",
      description: desc || "Custom apparel category."
    };

    window.PR_DB.addCategory(newCat);
    showAdminNotification("New Category Created!");
    renderCategoriesList();
  });
}

function editProductPrompt(id) {
  const prod = window.PR_DB.getProductById(id);
  if (!prod) return;

  const newPrice = prompt(`Edit Price for ${prod.name}:`, prod.basePrice);
  if (newPrice !== null) {
    prod.basePrice = parseFloat(newPrice) || prod.basePrice;
    window.PR_DB.updateProduct(prod);
    showAdminNotification("Product Updated!");
    renderProductsList();
  }
}

function deleteProductAction(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    window.PR_DB.deleteProduct(id);
    showAdminNotification("Product Deleted!");
    renderProductsList();
    renderStats();
  }
}

function showAdminNotification(msg) {
  const container = document.createElement("div");
  container.className = "toast-notification success";
  container.innerHTML = `<span>${msg}</span>`;
  document.body.appendChild(container);
  setTimeout(() => container.classList.add("show"), 100);
  setTimeout(() => {
    container.classList.remove("show");
    setTimeout(() => container.remove(), 300);
  }, 3500);
}
