import Cookies from "js-cookie";

const CHANNEL_NAME = "auth_token_channel";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const EXPIRES_KEY = "auth_expires";

class TokenSync {
  constructor() {
    this.channel = null;
    this.listeners = new Set();
    this.lastToken = null;
    this.lastUser = null;

    if (typeof window !== "undefined") {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.setupListener();
      this.startCookieListener();
    }
  }

  setupListener() {
    if (this.channel) {
      this.channel.onmessage = (event) => {
        const { type, token, user, expires } = event.data;

        switch (type) {
          case "LOGIN":
            this.setCookie(TOKEN_KEY, token, expires);
            this.setCookie(USER_KEY, JSON.stringify(user), expires);
            this.setCookie(EXPIRES_KEY, expires, expires);
            this.lastToken = token;
            this.lastUser = JSON.stringify(user);
            this.notifyListeners({ type: "LOGIN", token, user });
            break;

          case "LOGOUT":
            this.clearAll();
            this.lastToken = null;
            this.lastUser = null;
            this.notifyListeners({ type: "LOGOUT" });
            break;

          case "TOKEN REFRESH":
            this.setCookie(TOKEN_KEY, token, expires);
            this.setCookie(EXPIRES_KEY, expires, expires);
            this.lastToken = token;
            this.notifyListeners({ type: "TOKEN_REFRESH", token });
            break;
        }
      };
    }
  }
  // Listen perubahan cookie dari port lain via polling
  startCookieListener() {
    // Initilize last values
    this.lastToken = Cookies.get(TOKEN_KEY) || null;
    this.lastUser = Cookies.get(USER_KEY) || null;

    this.cookieInterval = setInterval(() => {
      const currentToken = Cookies.get(TOKEN_KEY) || null;
      const currentUser = Cookies.get(USER_KEY) || null;

      // Cek jika ada perubahan
      const tokenChanged = currentToken !== this.lastToken;
      const userChanged = currentUser !== this.lastUser;

      if (tokenChanged || userChanged) {
        // Case 1: Login baru (token ada, sebelumnya null)
        if (currentToken && !this.lastToken) {
          this.lastToken = currentToken;
          this.lastUser = currentUser;

          const user = currentUser ? JSON.parse(currentUser) : null;
          this.notifyListeners({ type: "LOGIN", token: currentToken, user });
        } 
        // Case 2: Logout (token null, sebelumnya ada)
        else if (!currentToken && this.lastToken) {
          this.lastToken = null;
          this.lastUser = null;

          this.notifyListeners({ type: "LOGOUT" });
        } 
        // Case 3: Token refresh (token berubah tapi tetap ada)
        else if (
          currentToken &&
          this.lastToken &&
          currentToken !== this.lastToken
        ) {
          this.lastToken = currentToken;
          this.lastUser = currentUser;

          const user = currentUser ? JSON.parse(currentUser) : null;
          this.notifyListeners({
            type: "TOKEN_REFRESH",
            token: currentToken,
            user,
          });
        }
      }
    }, 1000); // Cek setiap 1 detik
  }
  // Get domain dari window location
  getCookieDomain() {
    if (typeof window === "undefined") return null;

    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "localhost";
    }

    return hostname;
  }
  // Set cookie dengan domain yang sama untuk semua port
  setCookie(key, value, expires) {
    const expiresDate = new Date(parseInt(expires));
    const domain = this.getCookieDomain();

    Cookies.set(key, value, {
      expires: expiresDate,
      path: "/",
      domain: domain,
      sameSite: "lax",
    });
  }

  getNext3AM() {
    const now = new Date();
    const next3AM = new Date();

    next3AM.setHours(3, 0, 0, 0);

    if (now >= next3AM) {
      next3AM.setDate(next3AM.getDate() + 1);
    }

    return next3AM.getTime();
  }
  // Cek apakah token sudah expired
  isTokenExpired() {
    if (typeof window === "undefined") return true;

    const expires = Cookies.get(EXPIRES_KEY);
    if (!expires) return true;

    const expiresTime = parseInt(expires, 10);
    const now = Date.now();

    return now >= expiresTime;
  }

  startExpiryChecker() {
    this.expiryInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        this.broadcastLogout();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }, 60 * 1000);
  }

  broadcastLogin(token, user) {
    // const expires = this.getNext3AM();
    const expires = Date.now() + 365 * 24 * 60 * 60 * 1000;

    this.setCookie(TOKEN_KEY, token, expires);
    this.setCookie(USER_KEY, JSON.stringify(user), expires);
    this.setCookie(EXPIRES_KEY, expires.toString(), expires);

    this.lastToken = token;
    this.lastUser = JSON.stringify(user);

    if (this.channel) {
      this.channel.postMessage({
        type: "LOGIN",
        token,
        user,
        expires: expires.toString(),
      });
    }
  }

  broadcastLogout() {
    this.clearAll();

    this.lastToken = null;
    this.lastUser = null;

    if (this.channel) {
      this.channel.postMessage({
        type: "LOGOUT",
      });
    }
  }

  broadcastTokenRefresh(token) {
    // const expires = this.getNext3AM();
    const expires = Date.now() + 365 * 24 * 60 * 60 * 1000;

    this.setCookie(TOKEN_KEY, token, expires);
    this.setCookie(EXPIRES_KEY, expires.toString(), expires);

    this.lastToken = token;

    if (this.channel) {
      this.channel.postMessage({
        type: "TOKEN_REFRESH",
        token,
        expires: expires.toString(),
      });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((callback) => callback(data));
  }

  getToken() {
    if (typeof window === "undefined") return null;

    if (this.isTokenExpired()) {
      this.clearAll();
      return null;
    }

    return Cookies.get(TOKEN_KEY) || null;
  }

  getUser() {
    if (typeof window === "undefined") return null;

    if (this.isTokenExpired()) {
      this.clearAll();
      return null;
    }

    const user = Cookies.get(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  // Get sisa waktu sebelum expired
  getTimeUntilExpiry() {
    if (typeof window === "undefined") return null;

    const expires = Cookies.get(EXPIRES_KEY);
    if (!expires) return null;

    const expiresTime = parseInt(expires, 10);
    const now = Date.now();
    const remaining = expiresTime - now;

    if (remaining <= 0) return null;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes, timestamp: expiresTime };
  }

  clearAll() {
    const domain = this.getCookieDomain();

    Cookies.remove(TOKEN_KEY, { path: "/", domain: domain });
    Cookies.remove(USER_KEY, { path: "/", domain: domain });
    Cookies.remove(EXPIRES_KEY, { path: "/", domain: domain });
  }
  // Cleanup interval saat destroy
  destroy() {
    if (this.expiryInterval) {
      clearInterval(this.expiryInterval);
    }
    if (this.cookieInterval) {
      clearInterval(this.cookieInterval);
    }
    if (this.channel) {
      this.channel.close();
    }
  }
}

export const tokenSync = new TokenSync();
