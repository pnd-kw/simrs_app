import Container from "@/components/Container";
import DataDokterForm from "./components/DataDokterForm";

const DataDokterLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <DataDokterForm />
      </div>
    </>
  );

  return <Container title="WS BRIDGING BPJS - DATA SEP" topContent={topContent} />;
};

export default DataDokterLayout;
