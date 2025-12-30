import { mockIgdResponse } from "../data/igd.data";

export let igdDB = [...mockIgdResponse.data];

export const resetIgdDB = () => {
  igdDB = [...mockIgdResponse.data];
};
