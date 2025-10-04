import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { useRouter } from "next/router";
import ArtistListScreenComponent from "./ArtistListScreenComponent";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export const ABC = [
    "A",
    "Á",
    "B",
    "C",
    "D",
    "E",
    "É",
    "F",
    "G",
    "H",
    "I",
    "Í",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "Ó",
    "Ö",
    "Ő",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "Ú",
    "Ü",
    "Ű",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];

export type TArtist = {
    id: string;
    name: string;
    albumCount: number;
    portrait?: string;
};

interface ArtistResponse {
    data: TArtist[];
    pagination: {
        current_page: number;
        total_pages: number;
        per_page: number;
        total_items: number;
    };
}

interface SearchParams {
    page: number;
    search: string;
    type: string;
    letter: string;
    showAlbumCover: boolean;
}

const ArtistListScreenContainer = () => {
    const router = useRouter();
    const perPage = 50;
    const { errorState, handleError, clearError, retry } = useErrorHandler();

    const [artists, setArtists] = useState<TArtist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [searchParams, setSearchParams] = useState<SearchParams>({
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
            const params = new URLSearchParams();
            params.append("page", searchParams.page.toString());
            params.append("per_page", perPage.toString());

            if (searchParams.search) params.append("search", searchParams.search);
            if (searchParams.type) params.append("type", searchParams.type);
            if (searchParams.letter) params.append("letter", searchParams.letter);
            if (searchParams.showAlbumCover) params.append("include_image", "true");

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!baseUrl) {
                throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is not set");
            }
            const url = `${baseUrl}/api/artists?${params.toString()}`;

            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = {
                    status: response.status,
                    message: `HTTP error! Status: ${response.status}`,
                };
                handleError(error);
                return;
            }

            const data: ArtistResponse = await response.json();

            if (!data || !data.data) {
                throw new Error("Invalid API response structure");
            }

            setArtists(data.data);

            const totalPages = data.pagination?.total_pages || 1;
            setTotalPages(totalPages);
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
        fetchArtists();
    }, [fetchArtists]);

    const updateUrl = (newParams: Partial<SearchParams>) => {
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

    const handleSearchSubmit = (e: FormEvent) => {
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

    return (
        <ArtistListScreenComponent
            artists={artists}
            loading={loading}
            errorState={errorState}
            totalPages={totalPages}
            currentPage={searchParams.page}
            searchTerm={tempSearchTerm}
            selectedType={searchParams.type}
            selectedLetter={searchParams.letter}
            handlePageChange={handlePageChange}
            handleTypeChange={handleTypeChange}
            handleLetterChange={handleLetterChange}
            handleSearchSubmit={handleSearchSubmit}
            clearSearch={clearSearch}
            setTempSearchTerm={setTempSearchTerm}
            showAlbumCover={searchParams.showAlbumCover}
            handleShowAlbumCoverSwitch={handleShowAlbumCoverSwitch}
            ABC={ABC}
            onRetry={handleRetry}
            onCloseError={clearError}
        />
    );
};

export default ArtistListScreenContainer;
