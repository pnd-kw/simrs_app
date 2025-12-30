import Container from '@/components/Container';
import TextDisplayLoketComp from './components/TextDisplayLoket/TextDisplayLoketComp';

const TextDisplayLoket = () => {
   const topContent = (
    <>
      <div className="w-full h-full">
        <TextDisplayLoketComp />
      </div>
    </>
  );
  return (
    <Container
      title="text display loket"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
}

export default TextDisplayLoket