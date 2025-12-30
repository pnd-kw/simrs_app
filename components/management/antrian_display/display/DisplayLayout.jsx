import Container from "@/components/Container";
import DisplayForm from "./components/DisplayForm";
import SearchDisplay from "./components/SearchDisplay";

const DisplayLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <DisplayForm />
      </div>
    </>
  );

  const bottomContent = (
    <div className="w-full h-full">
      <SearchDisplay />
    </div>
  );

  return (
    <Container
      title="antrian display"
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default DisplayLayout;
