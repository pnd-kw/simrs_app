import { http, HttpResponse } from "msw";
import { igdDB } from "../db/igd.db";

export const igdHandlers = [
  http.get("/registrasi/ugd", async ({ request }) => {
    await new Promise((r) => setTimeout(r, 500));

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const perPage = Number(url.searchParams.get("per_page") || 10);
    const tanggalMulai = url.searchParams.get("tanggal_mulai");
    const tanggalSelesai = url.searchParams.get("tanggal_selesai");
    const doctorId = url.searchParams.get("doctor_id");
    const search = url.searchParams.get("search");

    let data = [...igdDB];

    if (doctorId) {
      data = data.filter((item) => String(item.doctor_id) === doctorId);
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

  http.post("/registrasi/ugd", async ({ request }) => {
    const body = await request.json();

    const newData = {
      id: Math.floor(100000 + Math.random() * 900000),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    igdDB.unshift(newData);

    return HttpResponse.json(
      { message: "Berhasil menyimpan data" },
      { status: 201 }
    );
  }),

  http.put("/registrasi/ugd", async ({ request }) => {
    const body = await request.json();
    const id = body.id;

    const index = igdDB.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    igdDB[index] = {
      ...igdDB[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      message: "Berhasil memperbarui data",
      data: igdDB[index],
    });
  }),

  http.delete("/registrasi/ugd/:id", ({ params }) => {
    const { id } = params;

    const index = igdDB.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    igdDB.splice(index, 1);

    return HttpResponse.json({
      message: "Sukses",
    });
  }),
];
