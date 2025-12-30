import { mockRawatJalanResponse } from "../data/rawatjalan.data";

export let rajalDB = [...mockRawatJalanResponse.data];

export const resetRajalDB = () => {
  rajalDB = [...mockRawatJalanResponse.data];
};
