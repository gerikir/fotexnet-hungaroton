import React, { FormEvent } from "react";
import Layout from "../Layout";
import ArtistCard from "../ArtistCard";
import ArtistCardSkeleton from "../ArtistCard/ArtistCardSkeletonComponent";
import { ErrorDisplay } from "../ErrorDisplay";
import { TArtist } from "./ArtistListScreenContainer";
import { ErrorState } from "../../types/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";

interface TProps {
    loading: boolean;
    errorState: ErrorState;
    artists: TArtist[];
    totalPages: number;
    currentPage: number;
    searchTerm: string;
    selectedType: string;
    selectedLetter: string;
    ABC: string[];
    handlePageChange: (page: number) => void;
    handleSearchSubmit: (e: FormEvent) => void;
    setTempSearchTerm: (search: string) => void;
    handleTypeChange: (value: string) => void;
    handleLetterChange: (value: string) => void;
    clearSearch: () => void;
    showAlbumCover: boolean;
    handleShowAlbumCoverSwitch: (include: boolean) => void;
    onRetry: () => void;
    onCloseError: () => void;
}

const ArtistListScreenComponent = ({
    loading,
    errorState,
    artists,
    totalPages,
    currentPage,
    searchTerm,
    selectedType,
    selectedLetter,
    ABC,
    handlePageChange,
    handleSearchSubmit,
    setTempSearchTerm,
    handleTypeChange,
    handleLetterChange,
    clearSearch,
    showAlbumCover,
    handleShowAlbumCoverSwitch,
    onRetry,
    onCloseError,
}: TProps) => {
    return (
        <Layout>
            <div className="py-12">
                <h1 className="text-4xl font-bold">Artists</h1>

                <div className="mb-14 mt-8">
                    <div className="grid grid-cols-12 gap-4 lg:grid-cols-10">
                        <div className="col-span-full md:col-span-6 lg:col-span-2">
                            <form onSubmit={(e) => handleSearchSubmit(e)}>
                                <div className="relative">
                                    <Input
                                        placeholder="Search by name"
                                        value={searchTerm}
                                        onChange={(e) => setTempSearchTerm(e.target.value)}
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
                                onValueChange={(value) => handleTypeChange(value === "all" ? "" : value)}
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
                                onValueChange={(value) => handleLetterChange(value === "all" ? "" : value)}
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
                                <Switch
                                    id="album-cover"
                                    checked={showAlbumCover}
                                    onCheckedChange={handleShowAlbumCoverSwitch}
                                />
                                <Label htmlFor="album-cover" className="whitespace-nowrap">
                                    Show album cover
                                </Label>
                            </div>
                            <Button onClick={clearSearch} variant="outline" className="whitespace-nowrap">
                                Reset filters
                            </Button>
                        </div>
                    </div>
                </div>

                {loading && (
                    <>
                        <div className="mb-[120px] mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
                            {[...Array(8)].map((_, index) => (
                                <ArtistCardSkeleton key={index} />
                            ))}
                        </div>
                    </>
                )}

                {errorState.error && (
                    <ErrorDisplay
                        error={errorState.error}
                        isRetrying={errorState.isRetrying}
                        onRetry={onRetry}
                        onClose={onCloseError}
                        showRetryButton={errorState.error.retryable}
                    />
                )}

                {!loading && !errorState.error && (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
                            {artists.length > 0 ? (
                                artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)
                            ) : (
                                <div className="col-span-full text-center">
                                    <p>No results found for the search criteria.</p>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(currentPage - 1);
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const startPage = Math.max(1, currentPage - 2);
                                            const page = startPage + i;
                                            if (page > totalPages) return null;

                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === page}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(page);
                                                        }}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        {currentPage < totalPages && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(currentPage + 1);
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default ArtistListScreenComponent;
