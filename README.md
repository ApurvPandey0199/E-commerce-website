<div align="center">

# 🏬 PR Manufacturing Co. — Enterprise E-Commerce Platform

![Build Status](https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge&logo=github)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20ES6+-0A2540?style=for-the-badge&logo=javascript)
![Architecture](https://img.shields.io/badge/Architecture-B2B%20%2B%20B2C%20Custom-FF6B35?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-4285F4?style=for-the-badge)

**A high-performance, custom-built B2C & B2B E-Commerce Web Application designed for industrial apparel manufacturers, featuring custom fabric volume pricing, customizer engines, GST invoicing, order workflow management, and a role-based admin console.**

---

### 🌐 Live Public Demonstration
**GitHub Pages Deployment**: [https://apurvpandey0199.github.io/prmfg-ecommerce/index.html](https://apurvpandey0199.github.io/prmfg-ecommerce/index.html)

</div>

---

## 🌟 Key Features & Highlights

### 🎨 Brand Aesthetics & Design System
- **Corporate Color System**: Built with Deep Navy Blue (`#0A2540`) as primary corporate tone, Vibrant Industrial Orange (`#FF6B35`) as accent action tone, and high-contrast neutral surfaces.
- **Modern Typography**: Google Fonts integration using **Inter** for crisp readable body text and **Poppins** for bold headline branding.
- **Custom Monogram Branding**: Custom CSS-rendered monogram logo badge (`.logo-badge`).
- **Responsive Layout**: Mobile-first fluid grid architecture adapting seamlessly from 320px mobile screens up to 4K ultra-wide monitors.

### 🛍️ Customer Shopping Desk (B2C & B2B)
- **Interactive Shop Catalog**: Real-time category filtration, max price range slider/inputs, 300ms debounced search, and pagination.
- **Dynamic Category Routing**: Clean slug parameter routing (`category.html?slug=t-shirts`).
- **Product Detail Engine**: Fabric specification table (GSM weight, blend ratio, shrinkage rate, wash care), color swatches, size selector, quantity editor, "Add to Cart", and instant "Buy Now" direct checkout trigger.
- **Customer Rating & Reviews**: Full 5-star rating breakdown widget, verified buyer review cards, and review submission modal.

### 🛒 Cart, Checkout & Order Management
- **Cart Calculations**: Real-time line item quantity updates, free shipping progress bar, and 18% GST tax computation.
- **Multi-Method Checkout**: Address details collection with tax GSTIN fields, supporting **Cash on Delivery**, **UPI QR Code**, and **Credit/Debit Card** checkout flows.
- **Order Confirmation & Tracker**: Itemized tax invoice receipt with print/download functionality and interactive order workflow timeline (`Ordered` ➔ `Confirmed` ➔ `In Production` ➔ `Shipped` ➔ `Delivered`).

### ⚙️ Role-Based Admin Control Console (`/admin.html`)
- **Security Access Control**: Protected console restricted to users with the `admin` role (`admin@prmfg.com` / `admin123`).
- **Sales Analytics Overview**: Live metrics tracking Total Revenue Turnover, Total Orders Placed, Registered Customers, and Active Catalog Count.
- **Order Workflow Control**: Status switcher dropdown (`Pending` ➔ `Confirmed` ➔ `In Production` ➔ `Shipped` ➔ `Delivered`) updating local database state instantly.
- **Inventory CRUD**: Add product modal, edit base price & stock levels, delete product items.
- **Category & Customer Management**: Add categories and supervise registered buyer directory.

---

## 📁 Repository Structure

```
├── index.html           # Homepage (Hero, Categories, Bestsellers, Testimonials)
├── shop.html            # Shop Catalog with real-time filters & debounced search
├── catalog.html         # Full catalog alias route
├── category.html        # Single category view route by slug
├── product.html         # Product Detail Page with specs & reviews
├── cart.html            # Shopping cart with line items & tax calculation
├── checkout.html        # Checkout flow with address & multi-payment selection
├── order.html           # Order confirmation receipt & status timeline tracker
├── account.html         # Customer profile desk & order history
├── auth.html            # Login, Registration & Simulated Google OAuth
├── admin.html           # Protected Admin Control Console
├── about.html           # Factory capacity & brand story page
├── contact.html         # Sales inquiry form & contact panel
├── css/
│   ├── global.css       # Core design tokens, typography, utilities & components
│   └── pages.css        # Page-specific responsive layouts & media queries
├── js/
│   ├── db.js            # Simulated LocalStorage database & seed data
│   ├── auth.js          # Security guard, role checker & session manager
│   ├── shopify.js       # Storefront helper API layer
│   ├── main.js          # Header/Footer dynamic renderer & floating WhatsApp widget
│   └── admin.js         # Admin dashboard stats, order workflow & inventory CRUD
└── img/                 # High-resolution product images & visual assets
```

---

## 🔑 Test Credentials

| Account Role | Email Address | Password | Privileges |
|---|---|---|---|
| **Administrator** | `admin@prmfg.com` | `admin123` | Full access to Admin Console, Inventory CRUD & Order Workflow |
| **Corporate Customer** | `corporate@client.com` | `password` | Shopping, custom ordering, profile & order history |

---

## ⚡ Quick Start / Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ApurvPandey0199/prmfg-ecommerce.git
   ```
2. **Navigate to the directory**:
   ```bash
   cd prmfg-ecommerce
   ```
3. **Launch in Browser**:
   Open `index.html` directly in any web browser or use a live server extension.

---

## 👨‍💻 Developer Profile

**Apurv Pandey**  
GitHub: [@ApurvPandey0199](https://github.com/ApurvPandey0199)

*Crafted with high attention to performance, UI/UX aesthetics, and clean code principles.*
