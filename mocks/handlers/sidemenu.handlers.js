import { http, HttpResponse } from "msw";
import { mockSidemenuResponse } from "../data/sidemenu.data";

export const sidemenuHandlers = [
  http.get("/simrs/menu/sidelist", async ({ request }) => {
    const url = new URL(request.url);
    const isFunction = url.searchParams.get("is_function");

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let data = mockSidemenuResponse.data;

    if (isFunction === "true") {
      data = [];
    }

    return HttpResponse.json({
      message: "OK",
      data,
    });
  }),
];
