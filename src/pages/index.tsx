export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: '/products',
    },
  };
};

const Index = () => {
  return null;
};

export default Index;
