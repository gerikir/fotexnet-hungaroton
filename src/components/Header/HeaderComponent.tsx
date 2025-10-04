import React from "react";
import Image from "next/image";

const HeaderComponent: React.FC = () => {
    return (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white py-5 shadow-lg">
            <div className="container mx-auto flex items-center justify-center px-4">
                <Image src="/hungaroton-logo.png" alt="Fotexnet Hungaroton" width={200} height={150} />
            </div>
        </header>
    );
};

export default HeaderComponent;
