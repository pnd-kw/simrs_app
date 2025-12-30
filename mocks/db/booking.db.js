import { mockBookingResponse } from "../data/booking.data";

export let bookingDB = [...mockBookingResponse.data];

export const resetBookingDB = () => {
  bookingDB = [...mockBookingResponse.data];
};
