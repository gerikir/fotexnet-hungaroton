import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico?v=1" />
                <link rel="shortcut icon" href="/favicon.ico?v=1" />
                <link rel="apple-touch-icon" href="/favicon.ico?v=1" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Fotexnet Hungaroton</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
