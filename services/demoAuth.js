import { mockAuthResponse } from "@/mocks/data/auth.data";

export const demoLogin = async (username, password) => {
  await new Promise((r) => setTimeout(r, 800));

  if (username !== "admin" || password !== "admin123") {
    throw new Error("INVALID_CREDENTIALS");
  }

  return mockAuthResponse;
};

export const demoLogout = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return { message: "Logout sukses" };
};
