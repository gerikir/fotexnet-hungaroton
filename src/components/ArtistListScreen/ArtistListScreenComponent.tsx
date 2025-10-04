import React from "react";
import { Layout } from "../Layout";
import { ArtistCard } from "../ArtistCard";
import ArtistCardSkeleton from "../ArtistCard/ArtistCardSkeletonComponent";
import { ErrorDisplay } from "../ErrorDisplay";
import { Filters } from "../Filters";
import { Pagination } from "../Pagination";
import { useArtistsOptimized } from "@/hooks";

const ArtistListScreenComponent = () => {
    const {
        artists,
        loading,
        errorState,
        totalPages,
        currentPage,
        searchTerm,
        selectedType,
        selectedLetter,
        showAlbumCover,
        setTempSearchTerm,
        handlePageChange,
        handleTypeChange,
        handleLetterChange,
        handleSearchSubmit,
        clearSearch,
        handleShowAlbumCoverSwitch,
        onRetry,
        onCloseError,
    } = useArtistsOptimized();
    return (
        <Layout>
            <main className="relative pb-12 pt-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-[30%] w-screen -translate-x-[50vw] -translate-y-8 transform bg-gradient-to-b from-gray-400/30 to-transparent"></div>
                </div>

                <div className="container relative z-10 mx-auto px-4">
                    <h2 className="mb-8 text-3xl font-bold text-gray-900">Artists</h2>

                    <Filters
                        searchTerm={searchTerm}
                        selectedType={selectedType}
                        selectedLetter={selectedLetter}
                        showAlbumCover={showAlbumCover}
                        onSearchSubmit={handleSearchSubmit}
                        onSearchChange={setTempSearchTerm}
                        onTypeChange={handleTypeChange}
                        onLetterChange={handleLetterChange}
                        onShowAlbumCoverChange={handleShowAlbumCoverSwitch}
                        onClearSearch={clearSearch}
                    />
                    {loading && (
                        <>
                            <div className="mb-[120px] mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
                                {[...Array(8)].map((_, index) => (
                                    <ArtistCardSkeleton key={index} />
                                ))}
                            </div>
                        </>
                    )}

                    {errorState?.error && (
                        <ErrorDisplay
                            error={errorState.error}
                            isRetrying={errorState.isRetrying}
                            onRetry={onRetry}
                            onClose={onCloseError}
                            showRetryButton={errorState.error.retryable}
                        />
                    )}

                    {!loading && !errorState?.error && (
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

                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default ArtistListScreenComponent;
