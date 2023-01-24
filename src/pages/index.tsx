import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Layout } from 'src/components';

interface VideoFormData {
  droneID: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormData>();

  const onSubmit = handleSubmit(({ droneID }) => {
    void router.push(`video/${droneID}`);
  });

  return (
    <Layout>
      <form onSubmit={void onSubmit}>
        <div className="flex flex-col items-center">
          <p className="mt-2 text-white">Enter your DRONE ID to see video from drone</p>
          <input
            className="mt-2 w-full rounded-md bg-white px-3 py-2"
            placeholder="Drone ID"
            {...register('droneID', { required: true, pattern: /^[A-Z]{3}-[0-9]{6}/ })}
          />
          {errors.droneID?.type === 'required' && <span className="text-red-800">This field is required</span>}
          {errors.droneID?.type === 'pattern' && <span className="text-red-800">Wrong format</span>}

          <button
            type="submit"
            className="mt-2 rounded-md bg-violet-500 px-3 py-2 uppercase hover:bg-violet-600 active:bg-violet-700"
          >
            Open video stream
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Home;
