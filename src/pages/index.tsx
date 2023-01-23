import { type NextPage } from 'next';
import { api } from 'src/utils/api';
import { AppHead } from '../components';

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <AppHead />
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
        <div className='container flex flex-col items-center justify-center gap-12 px-4 py-16'>
          <div className='flex flex-col items-center gap-2 divide-y'>
            <p className='text-2xl text-white'>{hello.data ? hello.data.greeting : 'Loading tRPC query...'}</p>

            <p className='mt-2 text-white'>Enter your DRONE ID to see video from drone</p>
            <input className='mt-1 w-full rounded-md bg-white px-3 py-2' placeholder='Drone ID' />
            <button className='mt-1 rounded-md bg-violet-500 px-3 py-2 uppercase hover:bg-violet-600 active:bg-violet-700'>
              Open video stream
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
