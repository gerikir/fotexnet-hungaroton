import Head from "next/head";
import { Header } from "../Header";
import { Footer } from "../Footer";

interface LayoutProps {
    children?: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title key="title">Fotexnet Homework</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className="mx-auto w-full max-w-[1440px] flex-1 bg-background px-4 font-sans md:px-8 lg:px-12">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default LayoutComponent;
