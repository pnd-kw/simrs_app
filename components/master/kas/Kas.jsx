import React from "react";
import KasComponent from "./components/KasComponent";
import Container from "@/components/Container";

const Kas = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <KasComponent />
      </div>
    </>
  );
  return (
    <Container
      title="kas"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default Kas;
