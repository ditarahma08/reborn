import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AboutUs = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/about');
  }, []);

  return <></>;
};

export default AboutUs;
