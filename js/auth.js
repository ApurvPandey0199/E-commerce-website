// PR Manufacturing Co. - Authentication & Security Service

class AuthService {
  constructor() {
    this.currentUser = window.PR_DB.getCurrentUser();
  }

  getCurrentUser() {
    return window.PR_DB.getCurrentUser();
  }

  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  isAdmin() {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.role === "admin" || user.email.toLowerCase() === "admin@prmfg.com";
  }

  hasRole(roleName) {
    if (roleName === "admin") return this.isAdmin();
    return this.isLoggedIn();
  }

  login(email, password) {
    const user = window.PR_DB.getUserByEmail(email);
    if (!user) {
      return { success: false, error: "User account not found." };
    }
    if (user.password !== password) {
      return { success: false, error: "Invalid password entered." };
    }

    // Auto grant admin if email is admin@prmfg.com
    if (user.email.toLowerCase() === "admin@prmfg.com") {
      user.role = "admin";
    }

    window.PR_DB.setCurrentUser(user);
    window.dispatchEvent(new Event("authChanged"));
    return { success: true, user };
  }

  register(userData) {
    const existing = window.PR_DB.getUserByEmail(userData.email);
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    // Assign role automatically
    if (userData.email.toLowerCase() === "admin@prmfg.com") {
      userData.role = "admin";
    } else {
      userData.role = "customer";
    }

    if (!userData.addresses) {
      userData.addresses = userData.shippingAddress ? [userData.shippingAddress] : [];
    }

    const newUser = window.PR_DB.addUser(userData);
    window.PR_DB.setCurrentUser(newUser);
    window.dispatchEvent(new Event("authChanged"));
    return { success: true, user: newUser };
  }

  googleLoginSimulated() {
    // Simulated Google OAuth login
    const googleUser = {
      email: "google.user@example.com",
      password: "google_oauth_simulated",
      companyName: "Google Auth Client",
      contactPerson: "Alex Rivera",
      phone: "+91 98765 00000",
      role: "customer",
      addresses: ["12 Innovation Way, Tech Park, Bengaluru"]
    };

    let user = window.PR_DB.getUserByEmail(googleUser.email);
    if (!user) {
      user = window.PR_DB.addUser(googleUser);
    }
    window.PR_DB.setCurrentUser(user);
    window.dispatchEvent(new Event("authChanged"));
    return { success: true, user };
  }

  logout() {
    window.PR_DB.setCurrentUser(null);
    window.dispatchEvent(new Event("authChanged"));
  }
}

window.AuthService = new AuthService();
