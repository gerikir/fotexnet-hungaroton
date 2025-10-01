import { TArtist } from "../ArtistListScreen/ArtistListScreenContainer";
import { Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

const ArtistCardComponent = ({ artist }: { artist: TArtist }) => (
    <Card
        key={artist.id}
        sx={{
            display: "flex",
            height: "380px",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "24px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        }}
    >
        {/* Album cover image - takes most of the card height */}
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

        {/* Dark gray background text area at the bottom with gradient at top */}
        <div className="relative flex min-h-[108px] flex-col justify-between bg-gray-800 px-4 pb-4 pt-2 text-left">
            {/* Gradient overlay at the top of text panel */}
            <div className="absolute inset-x-0 bottom-[100%] h-28 bg-gradient-to-b from-transparent to-gray-800" />
            <Typography
                variant="h6"
                component="h3"
                className="!m-0 mb-1 !text-lg !font-bold !leading-tight !text-white"
                title={artist.name}
            >
                {artist.name}
            </Typography>
            <div className="flex items-center gap-2">
                <Typography variant="body2" className="!text-sm !text-gray-300">
                    {artist.albumCount} album{artist.albumCount !== 1 ? "s" : ""}
                </Typography>
            </div>
        </div>
    </Card>
);

export default ArtistCardComponent;
