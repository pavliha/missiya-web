import { type AppType } from 'next/app';
import Script from 'next/script';
import { api } from 'src/utils/api';
import 'src/styles/globals.css';

export const event = new Event('janus.loaded');

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Script src="/libs/janus.js" onLoad={() => window.dispatchEvent(event)} />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
