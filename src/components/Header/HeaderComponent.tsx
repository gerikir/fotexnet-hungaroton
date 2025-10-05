import React from "react";
import Image from "next/image";

const HeaderComponent: React.FC = () => {
    return (
        <header className="fixed left-0 w-screen top-0 z-50 h-14 border-b border-gray-200 bg-white shadow-lg lg:h-20">
            <div className="container mx-auto flex h-full items-center justify-center px-4">
                <Image src="/hungaroton-logo.png" alt="Fotexnet Hungaroton" width={200} height={150} />
            </div>
        </header>
    );
};

export default HeaderComponent;
