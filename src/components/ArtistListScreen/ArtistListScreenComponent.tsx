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
        totalItems,
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
        searchInputRef,
        showTooltip,
        handleTooltipChange,
    } = useArtistsOptimized();

    return (
        <Layout>
            <main className="relative pb-12 pt-24 lg:pt-32">
                <h2 className="mb-8 text-3xl font-bold text-gray-900">Artists</h2>

                <Filters
                    searchTerm={searchTerm}
                    selectedType={selectedType}
                    selectedLetter={selectedLetter}
                    showAlbumCover={showAlbumCover}
                    albumCount={totalItems}
                    loading={loading}
                    searchInputRef={searchInputRef}
                    showTooltip={showTooltip}
                    onSearchSubmit={handleSearchSubmit}
                    onSearchChange={setTempSearchTerm}
                    onTypeChange={handleTypeChange}
                    onLetterChange={handleLetterChange}
                    onShowAlbumCoverChange={handleShowAlbumCoverSwitch}
                    onClearSearch={clearSearch}
                    onTooltipChange={handleTooltipChange}
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

                        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                    </>
                )}
            </main>
        </Layout>
    );
};

export default ArtistListScreenComponent;
