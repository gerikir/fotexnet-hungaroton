import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ArtistCardSkeletonComponent = () => (
    <Card className="shadow-[0_6px_12px_rgba(0,0,0,0.35),0_3px_6px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)] flex h-96 flex-col overflow-hidden rounded-3xl">
        <div className="relative w-full flex-1">
            <Skeleton className="absolute inset-0 h-full w-full" />
        </div>
        <div className="relative flex min-h-[108px] flex-col justify-between bg-gray-800 px-4 pb-4 pt-2 text-left">
            <div className="absolute inset-x-0 bottom-[100%] h-28 bg-gradient-to-b from-transparent to-gray-800" />
            <Skeleton className="h-6 w-4/5 rounded bg-white/10" />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Skeleton className="h-4 w-8 rounded bg-white/10" />
                <Skeleton className="h-4 w-4 rounded bg-white/10" />
            </div>
        </div>
    </Card>
);

export default ArtistCardSkeletonComponent;
