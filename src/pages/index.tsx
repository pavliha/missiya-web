import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { SerialNumberForm, Layout, type VideoFormData } from 'src/components';

const Home: NextPage = () => {
  const router = useRouter();

  const submit = async ({ droneID }: VideoFormData) => {
    await router.push({
      pathname: '/video/[droneID]',
      query: { droneID: droneID.toLocaleUpperCase() },
    });
  };

  return (
    <Layout>
      <SerialNumberForm onSubmit={submit} />
    </Layout>
  );
};

export default Home;
