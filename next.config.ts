import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        domains: ["exam.api.fotex.net", "picsum.photos"],
    },
};

export default nextConfig;
