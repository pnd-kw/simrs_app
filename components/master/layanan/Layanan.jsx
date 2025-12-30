import React from "react";
import LayananComp from "./components/layanan/LayananComp";
import Container from "@/components/Container";

const Layanan = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <LayananComp />
      </div>
    </>
  );
  return (
    <Container
      title="layanan"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default Layanan;
