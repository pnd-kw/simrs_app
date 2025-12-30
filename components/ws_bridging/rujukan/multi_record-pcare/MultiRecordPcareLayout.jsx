import Container from "@/components/Container";
import MultiRecordPcareForm from "./components/MultiRecordPcareForm";

const MultiRecordPcareLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <MultiRecordPcareForm />
      </div>
    </>
  );

  return <Container title="WS BRIDGING BPJS - DATA SEP" topContent={topContent} />;
};

export default MultiRecordPcareLayout;
