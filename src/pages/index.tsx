import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { SerialNumberForm, Layout, type VideoFormValues } from 'src/components';

const Home: NextPage = () => {
  const router = useRouter();

  const submit = async ({ serialNumber }: VideoFormValues) => {
    await router.push({
      pathname: '/video/[serialNumber]',
      query: { serialNumber: serialNumber.toLocaleUpperCase() },
    });
  };

  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center justify-center flex-1">
        <SerialNumberForm onSubmit={submit} />
      </div>
    </Layout>
  );
};

export default Home;
