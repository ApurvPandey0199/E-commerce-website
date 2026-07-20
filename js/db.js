// PR Manufacturing Co. - Client Storage Database Layer & Services

const SEED_CATEGORIES = [
  { id: "cat-tshirts", name: "Corporate T-Shirts", slug: "t-shirts", image: "img/product-tshirt-1.png", description: "High-comfort 100% cotton crewneck and v-neck promotional t-shirts." },
  { id: "cat-polos", name: "Signature Polos", slug: "polos", image: "img/product-polo-1.png", description: "Heavyweight pique cotton collar polos with custom brand embroidery." },
  { id: "cat-hoodies", name: "Team Hoodies", slug: "hoodies", image: "img/product-hoodie-1.png", description: "Fleece pullovers and zippered hoodies built for university & corporate teams." },
  { id: "cat-uniforms", name: "Uniform Sets", slug: "uniforms", image: "img/product-tshirt-1.png", description: "Medical scrubs, industrial coveralls, and school uniform kits." },
  { id: "cat-jackets", name: "Storm Jackets", slug: "jackets", image: "img/product-hoodie-1.png", description: "Weather-resistant softshell jackets and windbreakers." },
  { id: "cat-gifts", name: "Promotional Gifts", slug: "gifts", image: "img/product-polo-1.png", description: "Canvas tote bags, caps, and custom merchandise." }
];

const SEED_PRODUCTS = [
  {
    id: "prod-classic-crew",
    name: "Classic Crewneck T-Shirt",
    slug: "classic-crewneck-tshirt",
    category: "t-shirts",
    category_id: "cat-tshirts",
    tagline: "100% Combed Bio-Washed Cotton",
    description: "Engineered for maximum softness and durable print application. Double-needle stitched hems, pre-shrunk fabric structure, and ideal for screen printing or heat transfers.",
    basePrice: 299,
    stock: 1500,
    moq: 30,
    rating: 4.8,
    reviews_count: 24,
    images: [
      "img/product-tshirt-1.png",
      "img/product-tshirt-1.png",
      "img/product-tshirt-1.png"
    ],
    colors: [
      { name: "Navy Blue", hex: "#0A2540" },
      { name: "Bright Orange", hex: "#FF6B35" },
      { name: "Charcoal Black", hex: "#1E293B" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    fabric: "180 GSM 100% Super Combed Cotton",
    specs: {
      "GSM Weight": "180 GSM",
      "Fabric Blend": "100% Super Combed Cotton",
      "Shrinkage Rate": "Less than 2%",
      "Wash Care": "Machine Wash Cold, Do Not Bleach",
      "Country of Origin": "India"
    },
    priceTiers: [
      { minQty: 30, price: 349 },
      { minQty: 100, price: 299 },
      { minQty: 500, price: 249 }
    ],
    reviews: [
      { id: "rev-1", user_name: "Rajesh Sharma (Apex Tech)", rating: 5, comment: "Exceptional fabric quality! Printed 500 units for our tech conference. Print colors popped perfectly.", date: "2026-06-14" },
      { id: "rev-2", user_name: "Ananya Roy", rating: 5, comment: "Super fast turnaround. The bio-wash finish gives it a very premium feel.", date: "2026-05-28" }
    ]
  },
  {
    id: "prod-pique-polo",
    name: "Signature Pique Corporate Polo",
    slug: "signature-pique-corporate-polo",
    category: "polos",
    category_id: "cat-polos",
    tagline: "230 GSM Heavyweight Honeycomb Pique",
    description: "Designed for corporate elegance. Features a ribbed collar, reinforced placket with matching buttons, and structured side vents for comfortable office wear.",
    basePrice: 499,
    stock: 1200,
    moq: 25,
    rating: 4.9,
    reviews_count: 18,
    images: [
      "img/product-polo-1.png",
      "img/product-polo-1.png"
    ],
    colors: [
      { name: "Navy Blue", hex: "#0A2540" },
      { name: "Vibrant Orange", hex: "#FF6B35" },
      { name: "Heather Gray", hex: "#94A3B8" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fabric: "230 GSM Cotton Pique Blend",
    specs: {
      "GSM Weight": "230 GSM",
      "Fabric Blend": "85% Cotton, 15% Polyester Pique",
      "Collar": "Ribbed Knit Collar & Cuff",
      "Embroidery Friendly": "Yes - High Stitch Density Tested"
    },
    priceTiers: [
      { minQty: 25, price: 599 },
      { minQty: 100, price: 499 },
      { minQty: 500, price: 429 }
    ],
    reviews: [
      { id: "rev-3", user_name: "Vikram Malhotra", rating: 5, comment: "The embroidery turned out sharp. Looks like luxury retail apparel.", date: "2026-06-02" }
    ]
  },
  {
    id: "prod-fleece-hoodie",
    name: "Heavyweight Custom Team Hoodie",
    slug: "heavyweight-custom-team-hoodie",
    category: "hoodies",
    category_id: "cat-hoodies",
    tagline: "320 GSM Brushed Fleece Pullover",
    description: "Ultimate warmth and durability. Double-layered hood with color-matched drawstrings, kangaroo pouch pocket, and heavy rib cuffs.",
    basePrice: 899,
    stock: 800,
    moq: 20,
    rating: 4.9,
    reviews_count: 32,
    images: [
      "img/product-hoodie-1.png",
      "img/product-hoodie-1.png"
    ],
    colors: [
      { name: "Deep Navy", hex: "#0A2540" },
      { name: "Flame Orange", hex: "#FF6B35" },
      { name: "Jet Black", hex: "#0F172A" }
    ],
    sizes: ["M", "L", "XL", "2XL"],
    fabric: "320 GSM Cotton-Poly Fleece",
    specs: {
      "GSM Weight": "320 GSM",
      "Interior": "Super Soft Brushed Fleece",
      "Pockets": "Front Kangaroo Pocket",
      "Hood": "Double-layered with drawstrings"
    },
    priceTiers: [
      { minQty: 20, price: 999 },
      { minQty: 100, price: 899 },
      { minQty: 300, price: 799 }
    ],
    reviews: [
      { id: "rev-4", user_name: "Karan Patel (IIT Fest)", rating: 5, comment: "Best hoodies we've ordered for our campus fest. Super warm and heavyweight!", date: "2026-04-10" }
    ]
  },
  {
    id: "prod-medical-scrubs",
    name: "Medical Comfort Fit Scrub Set",
    slug: "medical-comfort-fit-scrub-set",
    category: "uniforms",
    category_id: "cat-uniforms",
    tagline: "Anti-Microbial Moisture-Wicking Poly-Rayon",
    description: "Designed for hospital staff and healthcare professionals. Stain-resistant, ergonomic stretch fabric with multi-pocket top and cargo scrub pants.",
    basePrice: 749,
    stock: 600,
    moq: 30,
    rating: 4.7,
    reviews_count: 14,
    images: [
      "img/product-tshirt-1.png"
    ],
    colors: [
      { name: "Navy Blue", hex: "#0A2540" },
      { name: "Teal Green", hex: "#0D9488" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    fabric: "180 GSM Poly-Rayon Spandex Blend",
    specs: {
      "GSM Weight": "180 GSM",
      "Fabric Finish": "Anti-Microbial & Water-Repellent",
      "Pockets": "4 Utility Pockets (Top & Bottom)"
    },
    priceTiers: [
      { minQty: 30, price: 849 },
      { minQty: 100, price: 749 }
    ],
    reviews: []
  }
];

class DatabaseService {
  constructor() {
    this.STORAGE_KEY_PRODUCTS = "PR_DB_PRODUCTS_V2";
    this.STORAGE_KEY_CATEGORIES = "PR_DB_CATEGORIES_V2";
    this.STORAGE_KEY_CART = "PR_DB_CART_V2";
    this.STORAGE_KEY_ORDERS = "PR_DB_ORDERS_V2";
    this.STORAGE_KEY_USERS = "PR_DB_USERS_V2";
    this.STORAGE_KEY_CURRENT_USER = "PR_DB_CURRENT_USER_V2";
    this.STORAGE_KEY_REVIEWS = "PR_DB_REVIEWS_V2";
    
    this.init();
  }

  init() {
    // Seed Categories
    if (!localStorage.getItem(this.STORAGE_KEY_CATEGORIES)) {
      localStorage.setItem(this.STORAGE_KEY_CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    }
    // Seed Products
    if (!localStorage.getItem(this.STORAGE_KEY_PRODUCTS)) {
      localStorage.setItem(this.STORAGE_KEY_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    }
    // Seed Orders
    if (!localStorage.getItem(this.STORAGE_KEY_ORDERS)) {
      const sampleOrders = [
        {
          id: "PR-2026-1001",
          userEmail: "corporate@client.com",
          companyName: "Apex Innovations Pvt Ltd",
          gstin: "27AAPCA1234A1Z5",
          date: "2026-07-15",
          items: [
            { id: "prod-classic-crew", name: "Classic Crewneck T-Shirt", price: 299, qty: 100, color: "Navy Blue", size: "L" }
          ],
          subtotal: 29900,
          gst: 5382,
          shipping: 0,
          total: 35282,
          status: "In Production",
          paymentMethod: "Razorpay (UPI)",
          shippingAddress: "Plot 42, Hitech City, Hyderabad, Telangana - 500081",
          timeline: [
            { status: "Ordered", date: "2026-07-15 10:30 AM", done: true },
            { status: "Confirmed", date: "2026-07-15 02:15 PM", done: true },
            { status: "In Production", date: "2026-07-16 09:00 AM", done: true },
            { status: "Shipped", date: "", done: false },
            { status: "Delivered", date: "", done: false }
          ]
        }
      ];
      localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(sampleOrders));
    }
    // Seed Users & Seed Admin User
    if (!localStorage.getItem(this.STORAGE_KEY_USERS)) {
      const sampleUsers = [
        {
          email: "admin@prmfg.com",
          password: "admin123",
          companyName: "PR Manufacturing Corporate",
          contactPerson: "System Administrator",
          phone: "+91 99999 88888",
          role: "admin",
          addresses: ["PR Complex, Sector 4, Industrial Area, Mumbai, MH - 400001"]
        },
        {
          email: "corporate@client.com",
          password: "password",
          companyName: "Apex Innovations",
          contactPerson: "Rajesh Sharma",
          phone: "+91 98765 43210",
          gstin: "27AAPCA1234A1Z5",
          role: "customer",
          addresses: ["Plot 42, Hitech City, Hyderabad, Telangana - 500081"]
        }
      ];
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(sampleUsers));
    }
    // Seed Cart
    if (!localStorage.getItem(this.STORAGE_KEY_CART)) {
      localStorage.setItem(this.STORAGE_KEY_CART, JSON.stringify([]));
    }
  }

  // Categories Methods
  getCategories() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_CATEGORIES)) || SEED_CATEGORIES;
  }

  getCategoryBySlug(slug) {
    const cats = this.getCategories();
    return cats.find(c => c.slug === slug || c.id === slug);
  }

  addCategory(category) {
    const cats = this.getCategories();
    cats.push(category);
    localStorage.setItem(this.STORAGE_KEY_CATEGORIES, JSON.stringify(cats));
    return category;
  }

  // Products Methods
  getProducts() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_PRODUCTS)) || SEED_PRODUCTS;
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id || p.slug === id);
  }

  addProduct(product) {
    const products = this.getProducts();
    products.unshift(product);
    localStorage.setItem(this.STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    return product;
  }

  updateProduct(updatedProduct) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === updatedProduct.id);
    if (idx !== -1) {
      products[idx] = updatedProduct;
      localStorage.setItem(this.STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    }
    return updatedProduct;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }

  // Product Review Methods
  addReview(productId, review) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId || p.slug === productId);
    if (product) {
      if (!product.reviews) product.reviews = [];
      product.reviews.unshift(review);
      product.reviews_count = product.reviews.length;
      
      // Recalculate average rating
      const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.rating = (sum / product.reviews.length).toFixed(1);

      this.updateProduct(product);
    }
  }

  // Cart Methods
  getCart() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_CART)) || [];
  }

  updateCart(cartItems) {
    localStorage.setItem(this.STORAGE_KEY_CART, JSON.stringify(cartItems));
  }

  clearCart() {
    localStorage.setItem(this.STORAGE_KEY_CART, JSON.stringify([]));
  }

  // Orders Methods
  getOrders() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_ORDERS)) || [];
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  }

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(orders));
    return order;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      if (order.timeline) {
        const item = order.timeline.find(t => t.status === newStatus);
        if (item) {
          item.done = true;
          item.date = new Date().toLocaleString();
        }
      }
      localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(orders));
    }
    return order;
  }

  // Users Methods
  getUsers() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_USERS)) || [];
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user) {
    const users = this.getUsers();
    // Auto grant admin role if email is admin@prmfg.com
    if (user.email.toLowerCase() === "admin@prmfg.com") {
      user.role = "admin";
    } else if (!user.role) {
      user.role = "customer";
    }
    users.push(user);
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    return user;
  }

  // Current Session User
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_CURRENT_USER)) || null;
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY_CURRENT_USER);
    }
  }
}

window.PR_DB = new DatabaseService();
