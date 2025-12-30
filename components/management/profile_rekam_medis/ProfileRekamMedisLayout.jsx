import Container from "@/components/Container";
import ProfileRekamMedisForm from "./components/ProfileRekamMedisForm";
import SearcProfileRekamMedis from "./components/SearchProfileRekamMedis";

const ProfileRekamMedisLayout = () => {

  const topContent = (
    <>
      <div className="w-full h-full">
        <ProfileRekamMedisForm />
      </div>
    </>
  );

  const bottomContent = (
    <div className="w-full h-full">
      <SearcProfileRekamMedis />
    </div>
  );

  return (
    <Container
      title='rekam medis'
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default ProfileRekamMedisLayout;
