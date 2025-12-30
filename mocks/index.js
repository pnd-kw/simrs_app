import { asuransiHandlers } from "./handlers/asuransi.handlers";
import { authHandlers } from "./handlers/auth.handlers";
import { bookingHandlers } from "./handlers/booking.handlers";
import { dokterHandlers } from "./handlers/dokter.handlers";
import { igdHandlers } from "./handlers/igd.handlers";
import { jadwalHandlers } from "./handlers/jadwal.handlers";
import { layananHandlers } from "./handlers/layanan.handlers";
import { pasienHandlers } from "./handlers/pasien.handlers";
import { perusahaanHandlers } from "./handlers/perusahaan.handlers";
import { poliklinikHandlers } from "./handlers/poliklinik.handlers";
import { rajalListHandlers } from "./handlers/rajal.handlers";
import { sidemenuHandlers } from "./handlers/sidemenu.handlers";
import { triageHandlers } from "./handlers/triage.handlers";

export const handlers = [
  ...authHandlers,
  ...sidemenuHandlers,
  ...dokterHandlers,
  ...poliklinikHandlers,
  ...perusahaanHandlers,
  ...asuransiHandlers,
  ...rajalListHandlers,
  ...layananHandlers,
  ...jadwalHandlers,
  ...bookingHandlers,
  ...pasienHandlers,
  ...triageHandlers,
  ...igdHandlers,
];
