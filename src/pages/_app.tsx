import Script from 'next/script';
import { type AppType } from 'next/app';
import { api } from 'src/utils/api';
import 'src/styles/globals.css';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>Missiya</title>
        <link rel="icon" href="../../logo.svg" />
      </Head>
      <Script src="https://webrtc.github.io/adapter/adapter-8.1.0.js" />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
