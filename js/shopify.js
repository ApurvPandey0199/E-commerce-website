// Shopify Storefront API Service Simulator
// Interfaces with Shopify's GraphQL endpoint if config exists, otherwise falls back to LocalStorage DB.

class ShopifyService {
  constructor() {
    // Config values - can be set in a separate config or environment variables
    this.shopDomain = window.SHOPIFY_SHOP_DOMAIN || null;
    this.accessToken = window.SHOPIFY_STOREFRONT_TOKEN || null;
    this.apiVersion = "2023-07";
    this.isLive = !!(this.shopDomain && this.accessToken);
    
    if (this.isLive) {
      console.log("[Shopify] Initialized in LIVE mode. Connecting to " + this.shopDomain);
    } else {
      console.log("[Shopify] Initialized in SIMULATED mode. Using client-side LocalStorage DB.");
    }
  }

  // GraphQL query executor
  async _query(graphqlQuery, variables = {}) {
    if (!this.isLive) {
      throw new Error("Shopify Live mode is not configured. Running in simulation mode.");
    }

    const endpoint = `https://${this.shopDomain}/api/${this.apiVersion}/graphql.json`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": this.accessToken
        },
        body: JSON.stringify({ query: graphqlQuery, variables })
      });
      return await response.json();
    } catch (error) {
      console.error("[Shopify API Error]", error);
      throw error;
    }
  }

  // Query Products (Simulated or Real)
  async getProducts(categoryFilter = null) {
    if (this.isLive) {
      // Real Shopify GraphQL query for collection/products
      const query = `
        query getProducts($query: String) {
          products(first: 20, query: $query) {
            edges {
              node {
                id
                title
                description
                handle
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                      }
                    }
                  }
                }
                images(first: 2) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `;
      const searchStr = categoryFilter ? `tag:${categoryFilter}` : "";
      const result = await this._query(query, { query: searchStr });
      // Map live result to common catalog format
      return result.data.products.edges.map(edge => {
        const node = edge.node;
        return {
          id: node.id,
          name: node.title,
          description: node.description,
          basePrice: parseFloat(node.variants.edges[0]?.node.price.amount || 0),
          images: node.images.edges.map(imgEdge => imgEdge.node.url),
          // map details...
        };
      });
    } else {
      // Return simulated DB products
      const products = window.PR_DB.getProducts();
      if (categoryFilter && categoryFilter !== "all") {
        return products.filter(p => p.category === categoryFilter);
      }
      return products;
    }
  }

  // Query single product
  async getProductById(id) {
    if (this.isLive) {
      const query = `
        query getProduct($id: ID!) {
          product(id: $id) {
            id
            title
            description
            fabric: metafield(namespace: "custom", key: "fabric") { value }
            moq: metafield(namespace: "custom", key: "moq") { value }
            images(first: 5) {
              edges { node { url } }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price { amount }
                }
              }
            }
          }
        }
      `;
      const result = await this._query(query, { id });
      const p = result.data.product;
      return {
        id: p.id,
        name: p.title,
        description: p.description,
        fabric: p.fabric?.value || "Premium Apparel Blend",
        moq: parseInt(p.moq?.value || "50"),
        basePrice: parseFloat(p.variants.edges[0]?.node.price.amount || 0),
        images: p.images.edges.map(e => e.node.url),
        // variants and pricing tiers parsed from shopify metafields...
      };
    } else {
      return window.PR_DB.getProductById(id);
    }
  }

  // Get Cart items
  getCart() {
    return window.PR_DB.getCart();
  }

  // Add Item to Cart
  addToCart(cartItem) {
    const cart = this.getCart();
    
    // Check if the exact product variant with the exact customization already exists
    const existingIndex = cart.findIndex(item => 
      item.id === cartItem.id &&
      item.color === cartItem.color &&
      item.size === cartItem.size &&
      JSON.stringify(item.customization) === JSON.stringify(cartItem.customization)
    );

    if (existingIndex !== -1) {
      cart[existingIndex].qty += cartItem.qty;
      // Re-calculate the custom item's unit price based on new quantity tier
      cart[existingIndex].price = this.calculateUnitPrice(cart[existingIndex].id, cart[existingIndex].qty, cart[existingIndex].customization?.method);
    } else {
      cartItem.price = this.calculateUnitPrice(cartItem.id, cartItem.qty, cartItem.customization?.method);
      cart.push(cartItem);
    }
    
    window.PR_DB.updateCart(cart);
    // Dispatch custom event to notify main navigation cart badge
    window.dispatchEvent(new Event("cartUpdated"));
    return cart;
  }

  // Update item quantity
  updateCartQty(index, newQty) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      if (newQty <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].qty = newQty;
        // Recalculate price tier for this quantity
        cart[index].price = this.calculateUnitPrice(cart[index].id, newQty, cart[index].customization?.method);
      }
      window.PR_DB.updateCart(cart);
      window.dispatchEvent(new Event("cartUpdated"));
    }
    return cart;
  }

  // Remove from cart
  removeFromCart(index) {
    return this.updateCartQty(index, 0);
  }

  // Get Cart Summary totals
  getCartSummary() {
    const cart = this.getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
      // Calculate individual pricing with print setup/unit addition
      let itemUnitCost = item.price;
      if (item.customization && item.customization.method !== "None") {
        // Add customization print costs per unit
        // Screen print: +$20 per unit, Embroidery: +$45 per unit, DTG: +$35 per unit
        const method = item.customization.method;
        if (method === "Screen Print") itemUnitCost += 20;
        else if (method === "Embroidery") itemUnitCost += 45;
        else if (method === "DTG Print") itemUnitCost += 35;
      }
      subtotal += itemUnitCost * item.qty;
    });

    const gst = Math.round(subtotal * 0.18); // 18% Standard Indian GST on apparel
    const shipping = subtotal > 15000 || subtotal === 0 ? 0 : 750; // Free shipping over 15000 INR
    const total = subtotal + gst + shipping;

    return {
      subtotal,
      gst,
      shipping,
      total,
      count: cart.reduce((acc, curr) => acc + curr.qty, 0)
    };
  }

  // Calculate Unit Price based on Product Tiers and customization
  calculateUnitPrice(productId, qty, printMethod = "None") {
    const product = window.PR_DB.getProductById(productId);
    if (!product) return 0;
    
    // Find matching tier
    let tierPrice = product.basePrice;
    // Tiers are sorted ascending by minQty
    const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQty) {
        tierPrice = tier.price;
        break;
      }
    }
    return tierPrice;
  }

  // Submit Simulated B2B Checkout Order
  async submitOrder(checkoutDetails) {
    if (this.isLive) {
      // In live mode, we'd trigger a redirect to Shopify checkout url or create a checkout via SDK
      console.log("[Shopify] Creating checkout URL for live redirection...");
      return { success: true, redirectUrl: "https://checkout.shopify.com/mock-redirect" };
    } else {
      const cart = this.getCart();
      if (cart.length === 0) return { success: false, error: "Cart is empty" };

      const summary = this.getCartSummary();
      const orderId = "PR-2026-" + Math.floor(1000 + Math.random() * 9000);
      
      const newOrder = {
        id: orderId,
        userEmail: checkoutDetails.email,
        companyName: checkoutDetails.companyName,
        gstin: checkoutDetails.gstin || "N/A",
        date: new Date().toISOString().split("T")[0],
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          color: item.color,
          size: item.size,
          customization: item.customization ? { ...item.customization } : null
        })),
        subtotal: summary.subtotal,
        gst: summary.gst,
        shipping: summary.shipping,
        total: summary.total,
        status: "Ordered",
        paymentMethod: checkoutDetails.paymentMethod,
        shippingAddress: checkoutDetails.shippingAddress,
        timeline: [
          { status: "Ordered", date: new Date().toLocaleString(), done: true },
          { status: "Confirmed", date: "", done: false },
          { status: "In Production", date: "", done: false },
          { status: "Dispatched", date: "", done: false },
          { status: "Delivered", date: "", done: false }
        ]
      };

      window.PR_DB.addOrder(newOrder);
      window.PR_DB.clearCart();
      window.dispatchEvent(new Event("cartUpdated"));

      return { success: true, orderId };
    }
  }
}

window.ShopifyService = new ShopifyService();
