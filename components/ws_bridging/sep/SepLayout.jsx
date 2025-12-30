import Container from "@/components/Container";
import SepForm from "./components/SepForm";

const SepLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <SepForm />
      </div>
    </>
  );

  return <Container title="WS BRIDGING BPJS - DATA SEP" topContent={topContent} />;
};

export default SepLayout;
