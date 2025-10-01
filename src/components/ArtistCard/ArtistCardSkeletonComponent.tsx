import { Card, CardContent, Skeleton } from "@mui/material";

const ArtistCardSkeletonComponent = () => (
    <Card
        sx={{
            display: "flex",
            height: "384px", // h-96
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "24px", // rounded-3xl
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        }}
    >
        {/* Album cover skeleton - takes most of the card height */}
        <div className="relative w-full flex-1">
            <Skeleton variant="rectangular" width="100%" height="100%" className="absolute inset-0" />
        </div>

        {/* Dark gray background text area skeleton */}
        <div className="relative flex min-h-[108px] flex-col justify-between bg-gray-800 px-4 pb-4 pt-2 text-left">
            {/* Gradient overlay at the top of text panel */}
            <div className="absolute inset-x-0 bottom-[100%] h-28 bg-gradient-to-b from-transparent to-gray-800" />

            {/* Artist name skeleton */}
            <Skeleton
                variant="text"
                width="80%"
                height="24px"
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                }}
            />

            {/* Album count skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton
                    variant="text"
                    width="60px"
                    height="16px"
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                    }}
                />
            </div>
        </div>
    </Card>
);

export default ArtistCardSkeletonComponent;
