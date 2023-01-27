import Script from 'next/script';
import { type AppType } from 'next/app';
import { AppHead } from 'src/components';
import { api } from 'src/utils/api';
import 'src/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <AppHead />
      <Script src="https://webrtc.github.io/adapter/adapter-8.1.0.js" />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
