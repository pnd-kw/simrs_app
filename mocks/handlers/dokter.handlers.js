import { http, HttpResponse } from "msw";
import { mockDokterResponse } from "../data/dokter.data";

export const dokterHandlers = [
  http.get("/dokter/list", async ({ request }) => {
    const url = new URL(request.url);

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let data = mockDokterResponse.data;

    return HttpResponse.json({
      message: "OK",
      data,
    });
  }),
];
