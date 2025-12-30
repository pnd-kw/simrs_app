import { loginSanctum } from "@/api/auth/login";
import { logoutUser } from "@/api/auth/logout";
import { tokenSync } from "@/utils/tokenSync";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  aplikasi: [],

  login: async (username, password) => {
    set({ isLoading: true });

    try {
      const res = await loginSanctum({ username, password });

      const userData = {
        id_user: res.data.id,
        name: res.data.name,
        username: res.data.username,
        roles: res.data.roles,
      };

      set({
        user: userData,
        token: res.data.remember_token,
        aplikasi: res.data.aplikasi,
        isAuthenticated: true,
        isLoading: false,
      });

      tokenSync.broadcastLogin(res.data.remember_token, userData);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error", error);
    } finally {
      set({
        user: null,
        token: null,
        aplikasi: [],
        isAuthenticated: false,
        isLoading: false,
      });

      tokenSync.broadcastLogout();
    }
  },

  checkAuth: () => {
    const token = tokenSync.getToken();
    const user = tokenSync.getUser();

    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
      });
    } else {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  syncFromBroadcast: (data) => {
    switch (data.type) {
      case "LOGIN":
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
        });
        break;
      case "LOGOUT":
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          aplikasi: [],
        });

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
        break;
      case "TOKEN REFRESH":
        set({ token: data.token, user: data.user || get().user });
        break;
    }
  },
}));

export default useAuthStore;
