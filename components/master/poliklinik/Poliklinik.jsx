import Container from "@/components/Container";
import PoliklinikForm from "./components/poliklinik/PoliklinikForm";
import SearchPoliklinik from "./components/poliklinik/SearchPoliklinik";

const Poliklinik = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <PoliklinikForm />
      </div>
    </>
  );

  const bottomContent = (
    <div className="w-full h-full">
      <SearchPoliklinik />
    </div>
  );

  return (
    <Container
      title='Poliklinik'
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default Poliklinik;
