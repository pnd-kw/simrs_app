import useDoctorStore from "@/stores/useDoctorStore";

const useDoctor = () => {
  const rajalDoctorId = useDoctorStore((state) => state.rajal.doctor_id);
  const setRajalDoctor = useDoctorStore((state) => state.setRajalDoctor);
  const bookingDoctorId = useDoctorStore((state) => state.booking.doctor_id);
  const setBookingDoctor = useDoctorStore((state) => state.setBookingDoctor);

  return {
    rajalDoctorId,
    setRajalDoctor,
    bookingDoctorId,
    setBookingDoctor,
  };
};

export default useDoctor;
