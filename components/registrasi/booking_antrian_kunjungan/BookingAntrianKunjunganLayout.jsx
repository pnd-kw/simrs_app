import Container from "@/components/Container";
import BookingAntrianKunjunganForm from "./components/BookingAntrianKunjunganForm";
import SearchBookingAntrianKunjungan from "./components/SearchBookingAntrianKunjungan";

const BookingAntrianKunjunganLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <BookingAntrianKunjunganForm />
      </div>
    </>
  );

  const bottomContent = (
    <>
      <div className="w-full h-full overflow-x-auto">
        <SearchBookingAntrianKunjungan />
      </div>
    </>
  );

  return (
    <Container
      title="booking antrian"
      topContent={topContent}
      bottomContent={bottomContent}
      height={"min-h-[65vh]"}
    />
  );
};

export default BookingAntrianKunjunganLayout;
