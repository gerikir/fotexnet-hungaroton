import { renderHook, waitFor, act } from "@testing-library/react";
import { useRouter } from "next/router";
import { useArtists, useErrorHandler } from "@/hooks";
import { ArtistService } from "@/services/artistService";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../services/artistService");
jest.mock("../../hooks/useErrorHandler");

describe("useArtists", () => {
    const mockPush = jest.fn();
    const mockHandleError = jest.fn();
    const mockClearError = jest.fn();
    const mockRetry = jest.fn();

    const mockRouter = {
        push: mockPush,
        pathname: "/artists",
        query: {},
        isReady: true,
    };

    const mockErrorHandler = {
        errorState: null,
        handleError: mockHandleError,
        clearError: mockClearError,
        retry: mockRetry,
    };

    const mockArtistsData = {
        data: [
            { id: 1, name: "Artist 1", type: "band" },
            { id: 2, name: "Artist 2", type: "solo" },
        ],
        pagination: {
            total_pages: 5,
            current_page: 1,
            per_page: 50,
            total: 250,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useErrorHandler as jest.Mock).mockReturnValue(mockErrorHandler);
        (ArtistService.getArtists as jest.Mock).mockResolvedValue(mockArtistsData);
    });

    describe("Initialization", () => {
        it("should initialize with default values", async () => {
            const { result } = renderHook(() => useArtists());

            expect(result.current.loading).toBe(true);
            expect(result.current.currentPage).toBe(1);
            expect(result.current.searchTerm).toBe("");
            expect(result.current.selectedType).toBe("");
            expect(result.current.selectedLetter).toBe("");
            expect(result.current.showAlbumCover).toBe(false);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });

        it("should fetch artists on mount", async () => {
            renderHook(() => useArtists());

            await waitFor(() => {
                expect(ArtistService.getArtists).toHaveBeenCalledWith({
                    page: 1,
                    per_page: 50,
                    search: undefined,
                    type: undefined,
                    letter: undefined,
                    include_image: false,
                });
            });
        });

        it("should set artists and total pages after successful fetch", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.artists).toEqual(mockArtistsData.data);
                expect(result.current.totalPages).toBe(5);
                expect(result.current.loading).toBe(false);
            });
        });
    });

    describe("URL Query Parameters", () => {
        it("should initialize from URL query parameters", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: {
                    page: "3",
                    search: "test artist",
                    type: "band",
                    letter: "A",
                    include_image: "true",
                },
            });

            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.currentPage).toBe(3);
                expect(result.current.searchTerm).toBe("test artist");
                expect(result.current.selectedType).toBe("band");
                expect(result.current.selectedLetter).toBe("A");
                expect(result.current.showAlbumCover).toBe(true);
            });
        });

        it("should wait for router to be ready", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                isReady: false,
                query: { page: "5" },
            });

            const { result, rerender } = renderHook(() => useArtists());

            expect(result.current.currentPage).toBe(1);

            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                isReady: true,
                query: { page: "5" },
            });

            rerender();

            await waitFor(() => {
                expect(result.current.currentPage).toBe(5);
            });
        });
    });

    describe("Page Navigation", () => {
        it("should handle page change", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.handlePageChange(3);
            });

            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: { page: "3" },
                },
                undefined,
                { shallow: true },
            );
        });

        it("should not include page in query when page is 1", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: { page: "2" },
            });

            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.handlePageChange(1);
            });

            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: {},
                },
                undefined,
                { shallow: true },
            );
        });
    });

    describe("Search Functionality", () => {
        it("should update temp search term", async () => {
            const { result } = renderHook(() => useArtists());

            act(() => {
                result.current.setTempSearchTerm("new search");
            });

            expect(result.current.searchTerm).toBe("new search");
        });

        it("should handle search submit", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.setTempSearchTerm("metallica");
            });

            const mockEvent = {
                preventDefault: jest.fn(),
            } as unknown as React.FormEvent;

            act(() => {
                result.current.handleSearchSubmit(mockEvent);
            });

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: { search: "metallica" },
                },
                undefined,
                { shallow: true },
            );
        });

        it("should reset to page 1 when searching", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: { page: "5" },
            });

            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.setTempSearchTerm("search term");
            });

            const mockEvent = {
                preventDefault: jest.fn(),
            } as unknown as React.FormEvent;

            act(() => {
                result.current.handleSearchSubmit(mockEvent);
            });

            expect(mockPush).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.objectContaining({ search: "search term" }),
                }),
                undefined,
                { shallow: true },
            );
        });

        it("should clear search and filters", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: {
                    search: "test",
                    type: "band",
                    letter: "A",
                },
            });

            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.clearSearch();
            });

            expect(result.current.searchTerm).toBe("");
            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: {},
                },
                undefined,
                { shallow: true },
            );
        });
    });

    describe("Filter Changes", () => {
        it("should handle type change", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.handleTypeChange("band");
            });

            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: { type: "band" },
                },
                undefined,
                { shallow: true },
            );
        });

        it("should handle letter change", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.handleLetterChange("B");
            });

            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: { letter: "B" },
                },
                undefined,
                { shallow: true },
            );
        });

        it("should handle album cover switch", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.handleShowAlbumCoverSwitch(true);
            });

            expect(mockPush).toHaveBeenCalledWith(
                {
                    pathname: "/artists",
                    query: { include_image: "true" },
                },
                undefined,
                { shallow: true },
            );
        });

        it("should reset to page 1 when changing filters", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: { page: "3" },
            });

            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.handleTypeChange("solo");
            });

            expect(mockPush).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.not.objectContaining({ page: expect.anything() }),
                }),
                undefined,
                { shallow: true },
            );
        });
    });

    describe("Error Handling", () => {
        it("should handle fetch error", async () => {
            const mockError = new Error("Network error");
            (ArtistService.getArtists as jest.Mock).mockRejectedValueOnce(mockError);

            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(mockHandleError).toHaveBeenCalledWith(mockError);
                expect(result.current.artists).toEqual([]);
                expect(result.current.loading).toBe(false);
            });
        });

        it("should clear error before fetching", async () => {
            renderHook(() => useArtists());

            await waitFor(() => {
                expect(mockClearError).toHaveBeenCalled();
            });
        });

        it("should handle retry", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.onRetry();
            });

            expect(mockRetry).toHaveBeenCalled();
        });

        it("should close error", async () => {
            const { result } = renderHook(() => useArtists());

            act(() => {
                result.current.onCloseError();
            });

            expect(mockClearError).toHaveBeenCalled();
        });
    });

    describe("Data Fetching", () => {
        it("should fetch with all filters applied", async () => {
            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: {
                    page: "2",
                    search: "metallica",
                    type: "band",
                    letter: "M",
                    include_image: "true",
                },
            });

            renderHook(() => useArtists());

            await waitFor(() => {
                expect(ArtistService.getArtists).toHaveBeenCalledWith({
                    page: 2,
                    per_page: 50,
                    search: "metallica",
                    type: "band",
                    letter: "M",
                    include_image: true,
                });
            });
        });

        it("should refetch when search params change", async () => {
            const { rerender } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(ArtistService.getArtists).toHaveBeenCalledTimes(1);
            });

            (useRouter as jest.Mock).mockReturnValue({
                ...mockRouter,
                query: { search: "new search" },
            });

            rerender();

            await waitFor(() => {
                expect(ArtistService.getArtists).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("Complex URL Query Building", () => {
        it("should build query with multiple parameters", async () => {
            const { result } = renderHook(() => useArtists());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.setTempSearchTerm("test");
            });

            const mockEvent = {
                preventDefault: jest.fn(),
            } as unknown as React.FormEvent;

            act(() => {
                result.current.handleSearchSubmit(mockEvent);
            });

            act(() => {
                result.current.handleTypeChange("band");
            });

            act(() => {
                result.current.handleLetterChange("T");
            });

            act(() => {
                result.current.handleShowAlbumCoverSwitch(true);
            });

            act(() => {
                result.current.handlePageChange(2);
            });

            expect(mockPush).toHaveBeenLastCalledWith(
                {
                    pathname: "/artists",
                    query: {
                        page: "2",
                        search: "test",
                        type: "band",
                        letter: "T",
                        include_image: "true",
                    },
                },
                undefined,
                { shallow: true },
            );
        });
    });
});
