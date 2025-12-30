import Container from "@/components/Container";
import DaftarSpesialis from "./components/DaftarSpesialis.jsx";
import SpesialisComp from "./components/SpesialisComp.jsx";
import { useState } from "react";

const Spesialis = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const topContent = (
    <>
      <div className="w-full h-full">
        <SpesialisComp
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </div>
    </>
  );
  const bottomContent = (
    <>
      <div className="w-full h-full p-2 items-center">
        <DaftarSpesialis setSelectedRow={setSelectedRow} />
      </div>
    </>
  );
  return (
    <Container
      title="spesialis"
      topContent={topContent}
      bottomContent={bottomContent}
      height={"min-h-[15vh]"}
    />
  );
};

export default Spesialis;
