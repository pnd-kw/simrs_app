const Container = ({ title, topContent, bottomContent, height }) => {
  return (
    <div className="flex flex-col w-full min-h-screen px-2">
      <div className="text-md text-white font-normal uppercase bg-primary1 px-4">{title}</div>
      <div className={`${height} w-full bg-white shadow-lg mb-4 p-4`}>{topContent}</div>
      <div className="flex-1 w-full bg-white shadow-2xl">{bottomContent}</div>
    </div>
  );
};

export default Container;
