import { http, HttpResponse } from "msw";
import { mockPasienResponse } from "../data/pasien.data";
import { pasienDB } from "../db/pasien.db";

export const pasienHandlers = [
  http.get("/pasien", async ({ request }) => {
    await new Promise((r) => setTimeout(r, 500));

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const perPage = Number(url.searchParams.get("per_page") || 10);
    const noRm = url.searchParams.get("no_rm");
    const nama = url.searchParams.get("nama");
    const nik = url.searchParams.get("nik");
    const status = url.searchParams.get("status");
    const tglLahir = url.searchParams.get("tgl_lahir");

    let data = [...pasienDB];

    if (noRm) {
      data = data.filter((item) => item.norm === noRm);
    }

    if (nama) {
      const keyword = nama.toLowerCase();
      data = data.filter((item) =>
        item.fullname.toLowerCase().includes(keyword)
      );
    }

    if (nik) {
      data = data.filter((item) => item.nik === nik);
    }

    if (status !== null) {
      const statusBool = status === "true";
      data = data.filter((item) => item.status === statusBool);
    }

    if (tglLahir) {
      data = data.filter((item) => item.date_ob.split(" ")[0] === tglLahir);
    }

    const start = (page - 1) * perPage;
    const sliced = data.slice(start, start + perPage);

    return HttpResponse.json({
      message: "Sukses",
      data: sliced,
      meta: {
        current_page: page,
        perPage: perPage,
        total: data.length,
        last_page: Math.ceil(data.length / perPage),
      },
    });
  }),
];
