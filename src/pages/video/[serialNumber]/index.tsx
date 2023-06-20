import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout, VideoScript } from 'src/components';

const Video: NextPage = () => {
  const router = useRouter();
  const { serialNumber } = router.query;

  return (
    <Layout>
      <VideoScript serialNumber={String(serialNumber)} />
    </Layout>
  );
};

export default Video;
