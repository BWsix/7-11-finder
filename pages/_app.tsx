import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>7-11 finder</title>
        <meta name="title" content="7-11 finder" />
        <meta
          name="description"
          content="7-11 finder會在google map中自動標出離你最近的7-11"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
