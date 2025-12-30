import { http, HttpResponse } from "msw";
import { mockPoliklinikResponse } from "../data/poliklinik.data";

export const poliklinikHandlers = [
  http.get("/poliklinik/list", async ({ request }) => {
    const url = new URL(request.url);

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let data = mockPoliklinikResponse.data;

    return HttpResponse.json({
      message: "OK",
      data,
    });
  }),
];
