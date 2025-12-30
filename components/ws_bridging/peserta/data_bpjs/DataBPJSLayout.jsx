import DataBPJSForm from "./components/DataBPJSForm";

const DataBPJSLayout = () => {
  return (
    <>
      <div className="flex flex-col w-full min-h-screen px-2">
        <div className="text-md text-white font-normal uppercase bg-primary1 px-4">
          WS BRIDGING BPJS - DATA bpjs
        </div>
        <div className={`w-full bg-white shadow-lg mb-4 p-4`}>
          <DataBPJSForm />
        </div>
      </div>
      <div className="w-full h-full"></div>
    </>
  );
};

export default DataBPJSLayout;
