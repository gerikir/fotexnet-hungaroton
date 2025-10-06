import React from "react";
import Image from "next/image";

const HeaderComponent: React.FC = () => {
    return (
        <header className="fixed left-0 top-0 z-50 h-14 w-screen border-b border-gray-200 bg-white shadow-lg lg:h-20">
            <div className="container mx-auto flex h-full items-center justify-center px-4">
                <div className="relative h-16 w-40 lg:h-24 lg:w-56">
                    <Image
                        src="/hungaroton-logo.png"
                        alt="Fotexnet Hungaroton"
                        fill
                        priority
                        sizes="(max-width: 1024px) 160px, 224px"
                        className="object-contain"
                    />
                </div>
            </div>
        </header>
    );
};

export default HeaderComponent;
