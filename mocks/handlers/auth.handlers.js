import { http, HttpResponse } from "msw";
import { mockAuthResponse } from "../data/auth.data";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json();

    await new Promise((r) => setTimeout(r, 800));

    if (body.username !== "admin" || body.password !== "admin123") {
      return HttpResponse.json(
        { message: "Username atau password salah" },
        { status: 401 }
      );
    }

    return HttpResponse.json(mockAuthResponse);
  }),


  http.post("/user/logout", async ({ request }) => {
    await new Promise((r) => setTimeout(r, 300));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    return HttpResponse.json({
      message: "Logout sukses",
    });
  }),
];
