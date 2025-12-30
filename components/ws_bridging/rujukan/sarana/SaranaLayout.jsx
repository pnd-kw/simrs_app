import Container from "@/components/Container";
import SaranaForm from "./components/SaranaForm";

const SaranaLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <SaranaForm />
      </div>
    </>
  );

  return <Container title="WS BRIDGING BPJS - DATA SEP" topContent={topContent} />;
};

export default SaranaLayout;
