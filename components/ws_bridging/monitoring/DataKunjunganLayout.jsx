import Container from "@/components/Container";
import DataKunjunganForm from "./components/DataKunjunganForm";

const DataKunjunganLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <DataKunjunganForm />
      </div>
    </>
  );

  return <Container title="WS BRIDGING BPJS - DATA KUNJUNGAN" topContent={topContent} />;
};

export default DataKunjunganLayout;
