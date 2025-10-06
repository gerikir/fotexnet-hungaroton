import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swrConfig";
import { Poppins } from "next/font/google";

const sunflower = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
    variable: "--font-sunflower",
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig value={swrConfig}>
            <Head>
                <link rel="icon" href="/favicon.ico?v=1" />
                <link rel="shortcut icon" href="/favicon.ico?v=1" />
                <link rel="apple-touch-icon" href="/favicon.ico?v=1" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Fotexnet Hungaroton</title>
            </Head>
            <div className={sunflower.variable}>
                <Component {...pageProps} />
            </div>
        </SWRConfig>
    );
}

export default MyApp;
