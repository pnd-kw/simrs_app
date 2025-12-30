import { http, HttpResponse } from "msw";
import { bookingDB } from "../db/booking.db";

export const bookingHandlers = [
  http.get("/booking/rajal", async ({ request }) => {
    await new Promise((r) => setTimeout(r, 500));

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const perPage = Number(url.searchParams.get("per_page") || 10);
    const doctorId = url.searchParams.get("doctor_id");
    const idBooking = url.searchParams.get("id");
    const nama = url.searchParams.get("nama_pasien");
    const tanggalMulai = url.searchParams.get("tanggal_mulai");
    const tanggalSelesai = url.searchParams.get("tanggal_selesai");
    const jadwal = url.searchParams.get("schedule_doctor_id");
    const insurance = url.searchParams.get("insurance_id");
    const statusBooking = url.searchParams.get("status_booking");
    const bookingFrom = url.searchParams.get("booking_from");
    const statusRm = url.searchParams.get("status_rm");
    const statusReg = url.searchParams.get("status_registrasi");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let data = [...bookingDB];

    if (doctorId) {
      data = data.filter((item) => String(item.doctor_id) === doctorId);
    }

    if (idBooking) {
      data = data.filter((item) => String(item.id) === idBooking);
    }

    if (nama) {
      const keyword = nama.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(keyword));
    }

    if (tanggalMulai || tanggalSelesai) {
      data = data.filter((item) => {
        const itemDate = item.createdAt.split("T")[0];

        if (tanggalMulai && tanggalSelesai) {
          return itemDate >= tanggalMulai && itemDate <= tanggalSelesai;
        }
        if (tanggalMulai) return itemDate >= tanggalMulai;
        if (tanggalSelesai) return itemDate <= tanggalSelesai;
        return true;
      });
    }

    if (jadwal) {
      data = data.filter((item) => String(item.schedule_doctor_id) === jadwal);
    }

    if (insurance) {
      data = data.filter((item) => String(item.insurance_id) === insurance);
    }

    if (statusBooking) {
      data = data.filter((item) => item.status_booking === statusBooking);
    }

    if (bookingFrom) {
      data = data.filter((item) => item.booking_from === bookingFrom);
    }

    if (statusRm) {
      data = data.filter((item) => item.status_rm === statusRm);
    }

    if (statusReg) {
      data = data.filter((item) => item.status === statusReg);
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

  http.post("/booking/rajal", async ({ request }) => {
    const body = await request.json();

    const newData = {
      id: Math.floor(100000 + Math.random() * 900000),
      ...body,
      status_booking: true,
      initial: "DR",
      antrianno: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookingDB.unshift(newData);

    return HttpResponse.json(
      {
        message: "Berhasil menyimpan data",
      },
      { status: 201 }
    );
  }),

  http.put("/booking/rajal/cancel", async ({ request }) => {
    const body = await request.json();
    const id = body.id;

    const index = bookingDB.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    bookingDB[index] = {
      ...bookingDB[index],
      status_booking: false,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      message: "Berhasil membatalkan booking",
    });
  }),
];
