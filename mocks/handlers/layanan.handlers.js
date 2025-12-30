import { http, HttpResponse } from "msw";
import { mockLayananResponse } from "../data/layanan.data";

export const layananHandlers = [
  http.get("/jenis/layanan", async ({ request }) => {
    const url = new URL(request.url);

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let data = mockLayananResponse.data;

    return HttpResponse.json({
      message: "OK",
      data,
    });
  }),
];
