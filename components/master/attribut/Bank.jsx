import Container from "@/components/Container";
import BankComp from "./components/bank/BankComp";

const Bank = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <BankComp />
      </div>
    </>
  );
  return (
    <Container
      title="bank"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default Bank;
