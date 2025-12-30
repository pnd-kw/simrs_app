const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black/25 flex items-center justify-center">
      <div className="w-30 h-30 border-12 border-primary1 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
