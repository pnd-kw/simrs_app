import { mockPasienResponse } from "../data/pasien.data";

export let pasienDB = [...mockPasienResponse.data];

export const resetPasienDB = () => {
  pasienDB = [...mockPasienResponse.data];
};
