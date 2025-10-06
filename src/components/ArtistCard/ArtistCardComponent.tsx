import { TArtist } from "../../types/artist";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const ArtistCardComponent: React.FC<{ artist: TArtist }> = ({ artist }) => (
    <Card
        key={artist.id}
        className="flex h-96 flex-col overflow-hidden rounded-3xl shadow-[0_6px_12px_rgba(0,0,0,0.35),0_3px_6px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]"
    >
        <div className="relative w-full flex-1">
            <Image
                src={artist.portrait || "/album-placeholder.png"}
                alt={artist.name}
                fill
                sizes="500px"
                priority
                className="absolute inset-0 object-cover"
            />
        </div>

        <div className="relative flex min-h-[120px] flex-col justify-between bg-gray-800 p-4 text-left">
            <div className="absolute inset-x-0 bottom-[100%] h-28 bg-gradient-to-b from-transparent to-gray-800" />
            <h3 className="m-0 pr-12 text-lg font-bold leading-tight text-white" title={artist.name}>
                {artist.name}
            </h3>
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="text-sm text-gray-300">{artist.albumCount}</span>
                <Image src="/album.svg" alt="Album" width={16} height={16} className="opacity-70" />
            </div>
        </div>
    </Card>
);

export default ArtistCardComponent;
