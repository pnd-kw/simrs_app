import { http, HttpResponse } from "msw";
import { rajalDB } from "../db/rajal.db";

export const rajalListHandlers = [
  http.get("/registrasi/rajal", async ({ request }) => {
    await new Promise((r) => setTimeout(r, 500));

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const perPage = Number(url.searchParams.get("per_page") || 10);
    const doctorId = url.searchParams.get("doctor_id");
    const poliklinikId = url.searchParams.get("poliklinik_id");
    const tanggalMulai = url.searchParams.get("tanggal_mulai");
    const tanggalSelesai = url.searchParams.get("tanggal_selesai");
    const search = url.searchParams.get("search");

    let data = [...rajalDB];

    if (doctorId) {
      data = data.filter((item) => String(item.doctor_id) === doctorId);
    }

    if (poliklinikId) {
      data = data.filter(
        (item) => String(item.doctor_poliklinik_id) === poliklinikId
      );
    }

    if (tanggalMulai && tanggalSelesai) {
      const mulai = new Date(tanggalMulai);
      const selesai = new Date(tanggalSelesai);

      data = data.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= mulai && created <= selesai;
      });
    }

    if (search) {
      const keyword = search.toLowerCase();
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(keyword)
        )
      );
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

  http.post("/registrasi/rajal", async ({ request }) => {
    const body = await request.json();

    const newData = {
      id: Math.floor(100000 + Math.random() * 900000),
      ...body,
      initial: "DR",
      antrianno: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    rajalDB.unshift(newData);

    return HttpResponse.json(
      { message: "Berhasil menyimpan data" },
      { status: 201 }
    );
  }),

  http.put("/registrasi/rajal", async ({ request }) => {
    const body = await request.json();
    const id = body.id;

    const index = rajalDB.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    rajalDB[index] = {
      ...rajalDB[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      message: "Berhasil memperbarui data",
      data: rajalDB[index],
    });
  }),

  http.delete("/registrasi/rajal/:id", ({ params }) => {
    const { id } = params;

    const index = rajalDB.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    rajalDB.splice(index, 1);

    return HttpResponse.json({
      message: "Sukses",
    });
  }),
];
