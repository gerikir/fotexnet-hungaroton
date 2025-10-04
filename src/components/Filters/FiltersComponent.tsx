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
    onSearchSubmit: (e: React.FormEvent) => void;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onLetterChange: (value: string) => void;
    onShowAlbumCoverChange: (checked: boolean) => void;
    onClearSearch: () => void;
}

const FiltersComponent: React.FC<FiltersProps> = ({
    searchTerm,
    selectedType,
    selectedLetter,
    showAlbumCover,
    onSearchSubmit,
    onSearchChange,
    onTypeChange,
    onLetterChange,
    onShowAlbumCoverChange,
    onClearSearch,
}) => {
    return (
        <div className="mb-14 mt-8">
            <div className="grid grid-cols-12 gap-4 lg:grid-cols-10">
                <div className="col-span-full md:col-span-6 lg:col-span-2">
                    <form onSubmit={onSearchSubmit}>
                        <div className="relative">
                            <Input
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="h-10 bg-white"
                            />
                            <button type="submit" className="absolute right-3 top-2.5">
                                <Image src="/search.svg" alt="Search" width={20} height={20} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-span-full md:col-span-6 lg:col-span-2">
                    <Select
                        value={selectedType || "all"}
                        onValueChange={(value) => onTypeChange(value === "all" ? "" : value)}
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

                <div className="col-span-full md:col-span-6 lg:col-span-2">
                    <Select
                        value={selectedLetter || "all"}
                        onValueChange={(value) => onLetterChange(value === "all" ? "" : value)}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="All letters" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All letters</SelectItem>
                            {ABC.map((letter) => (
                                <SelectItem key={letter} value={letter}>
                                    {letter}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-full flex items-center justify-between gap-6 md:col-span-6 lg:col-span-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="album-cover" checked={showAlbumCover} onCheckedChange={onShowAlbumCoverChange} />
                        <Label htmlFor="album-cover" className="whitespace-nowrap">
                            Show album cover
                        </Label>
                    </div>
                    <Button onClick={onClearSearch} variant="outline" className="whitespace-nowrap">
                        Reset filters
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FiltersComponent;
