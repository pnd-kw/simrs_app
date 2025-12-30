import Container from "@/components/Container";
import JadwalDokterForm from "./components/JadwalDokterForm";
import SearchJadwalDokter from "./components/SearchJadwalDokter";

const JadwalDokter = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <JadwalDokterForm />
      </div>
    </>
  );

  const bottomContent = (
    <div className="w-full h-full">
      <SearchJadwalDokter />
    </div>
  );

  return (
    <Container
      title='Jadwal Dokter'
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default JadwalDokter;
