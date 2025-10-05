import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ABC } from "@/constants/abc";
import Image from "next/image";

interface FiltersProps {
    searchTerm: string;
    selectedType: string;
    selectedLetter: string;
    showAlbumCover: boolean;
    albumCount: number;
    loading: boolean;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    showTooltip: boolean;
    onSearchSubmit: (e: React.FormEvent) => void;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onLetterChange: (value: string) => void;
    onShowAlbumCoverChange: (checked: boolean) => void;
    onClearSearch: () => void;
    onTooltipChange: (show: boolean) => void;
}

const FiltersComponent: React.FC<FiltersProps> = ({
    searchTerm,
    selectedType,
    selectedLetter,
    showAlbumCover,
    albumCount,
    loading,
    searchInputRef,
    showTooltip,
    onSearchSubmit,
    onSearchChange,
    onTypeChange,
    onLetterChange,
    onShowAlbumCoverChange,
    onClearSearch,
    onTooltipChange,
}) => {
    const isClearDisabled = loading || (!searchTerm && !selectedType && !selectedLetter);

    return (
        <div className="mb-14 mt-8">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-full md:col-span-3 lg:col-span-3">
                    <form onSubmit={onSearchSubmit}>
                        <div className="relative">
                            <Input
                                ref={searchInputRef}
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-10 bg-white"
                                disabled={loading}
                            />
                            <button type="submit" className="absolute right-3 top-2.5">
                                <Image src="/search.svg" alt="Search" width={20} height={20} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-span-full md:col-span-3 lg:col-span-3">
                    <Select
                        value={selectedType || "all"}
                        onValueChange={(value) => onTypeChange(value === "all" ? "" : value)}
                        disabled={loading}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="is_composer">Composer</SelectItem>
                            <SelectItem value="is_performer">Performer</SelectItem>
                            <SelectItem value="is_primary">Primary</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-full md:col-span-3 lg:col-span-6">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex h-full items-center gap-2">
                            <Switch
                                id="album-cover"
                                className="self-center"
                                checked={showAlbumCover}
                                onCheckedChange={onShowAlbumCoverChange}
                                disabled={loading}
                            />
                            <Label htmlFor="album-cover" className="whitespace-nowrap text-sm">
                                Album cover
                            </Label>
                        </div>
                        <div className="flex items-center gap-3">
                            {!loading && (
                                <span className="text-sm text-gray-600">
                                    {albumCount} album{albumCount !== 1 ? "s" : ""}
                                </span>
                            )}
                            {!isClearDisabled && (
                                <div className="relative">
                                    <Button
                                        onClick={onClearSearch}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onMouseEnter={() => onTooltipChange(true)}
                                        onMouseLeave={() => onTooltipChange(false)}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </Button>
                                    {showTooltip && (
                                        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
                                            Clear filters
                                            <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="mt-4 flex justify-between gap-1">
                        {ABC.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => onLetterChange(selectedLetter === letter ? "" : letter)}
                                disabled={loading}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium ${
                                    selectedLetter === letter
                                        ? "border-[#459557] bg-[#459557] text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltersComponent;
