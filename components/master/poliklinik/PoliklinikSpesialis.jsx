import Container from '@/components/Container';
import PoliklinikSpesialisComp from './components/poliklinik_spesialis/PoliklinikSpesialisComp';

const PoliklinikSpesialis = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <PoliklinikSpesialisComp />
      </div>
    </>
  );
  return (
    <Container
      title="Poliklinik Spesialis"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
}

export default PoliklinikSpesialis