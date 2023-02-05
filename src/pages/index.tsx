import { useRouter } from 'next/router';
import React from 'react';

const Index = () => {
  const router = useRouter();
  React.useEffect(() => {
    router.push('/products');
  }, [router]);
  return null;
};

export default Index;
