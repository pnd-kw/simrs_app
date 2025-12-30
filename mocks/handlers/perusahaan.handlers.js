import { http, HttpResponse } from "msw";
import { mockPerusahaanResponse } from "../data/perusahaan.data";

export const perusahaanHandlers = [
  http.get("/perusahaan/list", async ({ request }) => {
    const url = new URL(request.url);

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let data = mockPerusahaanResponse.data;

    return HttpResponse.json({
      message: "OK",
      data,
    });
  }),
];
