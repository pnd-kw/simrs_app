import useBookingStore from "@/stores/booking_antrian_kunjungan/useBookingStore";

const useBookingRs = () => {
  const bookingRsData = useBookingStore(
    (state) => state.bookingRs.bookingRsData
  );
  const setBookingRsData = useBookingStore((state) => state.setBookingRsData);
  const isSuccessSubmitBookingRs = useBookingStore(
    (state) => state.bookingRs.isSuccessSubmitBookingRs
  );
  const setIsSuccessSubmitBookingRs = useBookingStore(
    (state) => state.setIsSuccessSubmitBookingRs
  );

  return {
    bookingRsData,
    setBookingRsData,
    isSuccessSubmitBookingRs,
    setIsSuccessSubmitBookingRs,
  };
};

export default useBookingRs;
