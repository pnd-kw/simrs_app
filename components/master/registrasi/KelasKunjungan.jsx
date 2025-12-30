import Container from '@/components/Container';
import React from 'react'
import KelasKunjunganComp from './components/KelasKunjungan/KelasKunjunganComp';

const KelasKunjungan = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <KelasKunjunganComp />
      </div>
    </>
  );
  return (
    <Container
      title="kelas kunjungan"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
}

export default KelasKunjungan