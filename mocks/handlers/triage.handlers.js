import { http, HttpResponse } from "msw";
import { mockTriageResponse } from "../data/triage.data";

export const triageHandlers = [
  http.get("/triage", async ({ request }) => {
    await new Promise((r) => setTimeout(r, 500));

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const perPage = Number(url.searchParams.get("per_page") || 10);
    const tanggalMulai = url.searchParams.get("tanggal_mulai");
    const tanggalSelesai = url.searchParams.get("tanggal_selesai");

    let data = [...mockTriageResponse.data];

    if (tanggalMulai && tanggalSelesai) {
      const mulai = new Date(tanggalMulai);
      const selesai = new Date(tanggalSelesai);

      data = data.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= mulai && created <= selesai;
      });
    }

    const start = (page - 1) * perPage;
    const sliced = data.slice(start, start + perPage);

    return HttpResponse.json({
      message: "Sukses",
      data: sliced,
      meta: {
        current_page: page,
        per_page: perPage,
        total: data.length,
        last_page: Math.ceil(data.length / perPage),
      },
    });
  }),
];
