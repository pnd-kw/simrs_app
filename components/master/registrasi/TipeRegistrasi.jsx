import Container from "@/components/Container";
import React from "react";
import TipeRegistrasiComp from "./components/TipeRegistrasi/TipeRegistrasiComp";

const TipeRegistrasi = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <TipeRegistrasiComp />
      </div>
    </>
  );
  return (
    <Container
      title="tipe registrasi"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default TipeRegistrasi;
