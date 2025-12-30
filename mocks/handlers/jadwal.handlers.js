import { http, HttpResponse } from "msw";
import { mockJadwalResponse } from "../data/jadwal.data";

export const jadwalHandlers = [
  http.get("/dokter/jadwal", async ({ request }) => {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get("doctor_id");

    await new Promise((r) => setTimeout(r, 500));

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!doctorId) {
      return HttpResponse.json(
        { message: "doctor_id is required", data: [] },
        { status: 400 }
      );
    }

    const filtered = mockJadwalResponse.data.filter(
      (item) => String(item.doctor_id.id) === String(doctorId)
    );

    return HttpResponse.json({
      message: "Sukses",
      data: filtered,
    });
  }),
];
