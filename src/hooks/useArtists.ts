import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { ArtistService, ArtistFilters } from "@/services/artistService";
import { TArtist, TSearchParams } from "@/types/artist";
import { useErrorHandler } from "./useErrorHandler";

export const useArtists = () => {
    const router = useRouter();
    const perPage = 50;
    const { errorState, handleError, clearError, retry } = useErrorHandler();

    const [artists, setArtists] = useState<TArtist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [searchParams, setSearchParams] = useState<TSearchParams>({
        page: 1,
        search: "",
        type: "",
        letter: "",
        showAlbumCover: false,
    });

    const [tempSearchTerm, setTempSearchTerm] = useState<string>("");

    const fetchArtists = useCallback(async () => {
        setLoading(true);
        clearError();

        try {
            const filters: ArtistFilters = {
                page: searchParams.page,
                per_page: perPage,
                search: searchParams.search || undefined,
                type: searchParams.type || undefined,
                letter: searchParams.letter || undefined,
                include_image: searchParams.showAlbumCover,
            };

            const data = await ArtistService.getArtists(filters);
            setArtists(data.data);
            setTotalPages(data.pagination.total_pages);
        } catch (err) {
            handleError(err);
            setArtists([]);
        } finally {
            setLoading(false);
        }
    }, [
        searchParams.page,
        searchParams.search,
        searchParams.type,
        searchParams.letter,
        searchParams.showAlbumCover,
        clearError,
        handleError,
    ]);

    useEffect(() => {
        if (!router.isReady) return;

        const { page, search, type, letter, include_image } = router.query;

        const newParams: TSearchParams = {
            page: page && typeof page === "string" ? parseInt(page) : 1,
            search: search && typeof search === "string" ? search : "",
            type: type && typeof type === "string" ? type : "",
            letter: letter && typeof letter === "string" ? letter : "",
            showAlbumCover: include_image === "true",
        };

        setSearchParams(newParams);
        setTempSearchTerm(newParams.search);
    }, [router.isReady, router.query]);

    useEffect(() => {
        fetchArtists();
    }, [fetchArtists]);

    const updateUrl = (newParams: Partial<TSearchParams>) => {
        const updatedParams = { ...searchParams, ...newParams };

        setSearchParams(updatedParams);

        const query: Record<string, string> = {};

        if (updatedParams.page !== 1) query.page = updatedParams.page.toString();
        if (updatedParams.search) query.search = updatedParams.search;
        if (updatedParams.type) query.type = updatedParams.type;
        if (updatedParams.letter) query.letter = updatedParams.letter;
        if (updatedParams.showAlbumCover) query.include_image = "true";

        router.push(
            {
                pathname: router.pathname,
                query,
            },
            undefined,
            { shallow: true },
        );
    };

    const handlePageChange = (page: number) => {
        updateUrl({ page });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUrl({ page: 1, search: tempSearchTerm });
    };

    const clearSearch = () => {
        setTempSearchTerm("");
        updateUrl({ page: 1, search: "", type: "", letter: "" });
    };

    const handleTypeChange = (value: string) => {
        updateUrl({ page: 1, type: value });
    };

    const handleLetterChange = (value: string) => {
        updateUrl({ page: 1, letter: value });
    };

    const handleShowAlbumCoverSwitch = (include: boolean) => {
        updateUrl({ showAlbumCover: include });
    };

    const handleRetry = () => {
        retry(fetchArtists);
    };

    return {
        // State
        artists,
        loading,
        totalPages,
        currentPage: searchParams.page,
        searchTerm: tempSearchTerm,
        selectedType: searchParams.type,
        selectedLetter: searchParams.letter,
        showAlbumCover: searchParams.showAlbumCover,
        errorState,

        // Actions
        setTempSearchTerm,
        handlePageChange,
        handleTypeChange,
        handleLetterChange,
        handleSearchSubmit,
        clearSearch,
        handleShowAlbumCoverSwitch,
        onRetry: handleRetry,
        onCloseError: clearError,
    };
};
