import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ArtistService, ArtistFilters } from "../services/artistService";
import { SearchParams } from "../types/artist";
import { useErrorHandler } from "./useErrorHandler";
import { useDebounce } from "./useDebounce";

const fetcher = async (url: string, filters: ArtistFilters) => {
    const data = await ArtistService.getArtists(filters);
    return data;
};

const getCacheKey = (filters: ArtistFilters) => {
    const params = new URLSearchParams();
    params.append("page", filters.page.toString());
    params.append("per_page", filters.per_page.toString());

    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.letter) params.append("letter", filters.letter);
    if (filters.include_image) params.append("include_image", "true");

    return `artists-${params.toString()}`;
};

export const useArtistsOptimized = () => {
    const router = useRouter();
    const perPage = 50;
    const { errorState, handleError, clearError } = useErrorHandler();

    const [searchParams, setSearchParams] = useState<SearchParams>({
        page: 1,
        search: "",
        type: "",
        letter: "",
        showAlbumCover: false,
    });

    const [tempSearchTerm, setTempSearchTerm] = useState<string>("");

    const debouncedSearch = useDebounce(tempSearchTerm, 300);

    const currentFilters: ArtistFilters = useMemo(
        () => ({
            page: searchParams.page,
            per_page: perPage,
            search: searchParams.search || undefined,
            type: searchParams.type || undefined,
            letter: searchParams.letter || undefined,
            include_image: searchParams.showAlbumCover,
        }),
        [searchParams, perPage],
    );

    const { data, error, isLoading, mutate } = useSWR(
        getCacheKey(currentFilters),
        () => fetcher(getCacheKey(currentFilters), currentFilters),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 2000,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
            onError: (err) => {
                handleError(err);
            },
        },
    );

    useEffect(() => {
        if (!router.isReady) return;

        const { page, search, type, letter, include_image } = router.query;

        const newParams: SearchParams = {
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
        if (debouncedSearch !== searchParams.search) {
            setSearchParams((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
        }
    }, [debouncedSearch, searchParams.search]);

    const updateUrl = useCallback(
        (newParams: Partial<SearchParams>) => {
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
        },
        [searchParams, router],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            updateUrl({ page });
        },
        [updateUrl],
    );

    const handleSearchSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            updateUrl({ page: 1, search: tempSearchTerm });
        },
        [updateUrl, tempSearchTerm],
    );

    const clearSearch = useCallback(() => {
        setTempSearchTerm("");
        updateUrl({ page: 1, search: "", type: "", letter: "" });
    }, [updateUrl]);

    const handleTypeChange = useCallback(
        (value: string) => {
            updateUrl({ page: 1, type: value });
        },
        [updateUrl],
    );

    const handleLetterChange = useCallback(
        (value: string) => {
            updateUrl({ page: 1, letter: value });
        },
        [updateUrl],
    );

    const handleShowAlbumCoverSwitch = useCallback(
        (include: boolean) => {
            updateUrl({ showAlbumCover: include });
        },
        [updateUrl],
    );

    const handleRetry = useCallback(() => {
        mutate(); // SWR revalidation
    }, [mutate]);

    const artists = data?.data || [];
    const totalPages = data?.pagination?.total_pages || 1;
    const loading = isLoading;
    const hasError = !!error;

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
        errorState: hasError ? errorState : null,

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
