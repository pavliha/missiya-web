import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout, VideoScript } from 'src/components';

const Video: NextPage = () => {
  const router = useRouter();
  const { serialNumber } = router.query;

  console.log(router.query.serialNumber);
  

  return (
    <Layout>
      <p className="pb-24 text-2xl text-white">Video Stream page {serialNumber}</p>
      <VideoScript serialNumber={String(serialNumber)} />
    </Layout>
  );
};

export default Video;
