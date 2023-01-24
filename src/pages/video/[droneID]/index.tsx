import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import useScript from 'react-script-hook';
import { Layout } from 'src/components';
import { loadJanus } from 'src/utils/janus';

const Video: NextPage = () => {
  const router = useRouter();
  const { droneID } = router.query;

  const [loading, error] = useScript({
    src: '/libs/janus.js',
    onload: () => {
      console.log(23123);
      loadJanus('http://165.232.66.224:8088/janus');
    },
  });

  if (loading) return <p className="text-white">Loading Stripe API...</p>;
  if (error) return <h3 className="text-white">Failed to load Stripe API: {error.message}</h3>;

  return (
    <Layout>
      <p className="text-white">Video Stream page {droneID}</p>
      <video className="aspect-video w-full" id="webrtc-output" autoPlay playsInline poster="/logo.svg" />
    </Layout>
  );
};

export default Video;
