import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout, VideoScript } from 'src/components';

const Video: NextPage = () => {
  const router = useRouter();
  const { droneID } = router.query;

  return (
    <Layout>
      <p className="pb-24 text-2xl text-white">Video Stream page {droneID}</p>
      <VideoScript />
    </Layout>
  );
};

export default Video;
