import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { DroneIDForm, Layout, type VideoFormData } from 'src/components';

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
      <DroneIDForm onSubmit={submit} />
    </Layout>
  );
};

export default Home;
