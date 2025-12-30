import { http, HttpResponse } from "msw";
import { mockAsuransiResponse } from "../data/asuransi.data";

export const asuransiHandlers = [
  http.get("/asuransi", async ({ request }) => {
    const url = new URL(request.url);

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let data = mockAsuransiResponse.data;

    return HttpResponse.json({
      message: "OK",
      data,
    });
  }),
];
