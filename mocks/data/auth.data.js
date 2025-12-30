export const mockAuthResponse = {
  message: "Login Sukses",
  data: {
    id: 300,
    username: "admin",
    name: "Admin",
    aplikasi: [
      {
        code: "APP_DEMO",
        nama_aplikasi: "Demo Aplikasi SIMRS",
        icon: {
          icon: "mdi-monitor-dashboard",
          size: "18",
          color: "#003A6B",
        },
        url: "/dashboard",
      },
    ],
    roles: [
      {
        code: "ADMIN",
        nama_role: "Administrator",
        icon: {
          icon: "mdi-account-cog",
          size: "20",
          color: "#3776A1",
        },
      },
    ],
    remember_token: "mock-token-123456",
  },
};
