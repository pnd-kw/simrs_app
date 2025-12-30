import Container from "@/components/Container";
import CariSepRencanaKontrolForm from "./components/CariSepForm";

const CariSepRencanaKontrolLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <CariSepRencanaKontrolForm />
      </div>
    </>
  );

  return <Container title="WS BRIDGING BPJS - DATA SEP" topContent={topContent} />;
};

export default CariSepRencanaKontrolLayout;
