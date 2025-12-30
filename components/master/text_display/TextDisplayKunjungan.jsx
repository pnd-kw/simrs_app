import React from 'react'
import TextDisplayKunjunganComp from './components/TextDisplayKunjungan/TextDisplayKunjunganComp';
import Container from '@/components/Container';

const TextDisplayKunjungan = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <TextDisplayKunjunganComp />
      </div>
    </>
  );
  return (
    <Container
      title="text display kunjungan"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};


export default TextDisplayKunjungan