import { ArtistService } from "@/services/artistService";

global.fetch = jest.fn();

const createMockResponse = (data: any, ok = true, status = 200): Response =>
    ({
        ok,
        status,
        statusText: ok ? "OK" : "Error",
        headers: new Headers(),
        redirected: false,
        type: "basic" as ResponseType,
        url: "http://localhost/api/artists",
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
        json: () => Promise.resolve(data),
        bytes: jest.fn(),
    }) as unknown as Response;

describe("ArtistService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch artists with correct parameters", async () => {
        const mockResponse = {
            data: [{ id: 1, name: "Test Artist" }],
            pagination: { total_pages: 1 },
        };

        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(createMockResponse(mockResponse));

        const filters = {
            page: 1,
            per_page: 50,
            search: "test",
            type: "composer",
        };

        const result = await ArtistService.getArtists(filters);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/artists"),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }),
            }),
        );

        expect(result).toEqual(mockResponse);
    });

    it("should handle search parameters correctly", async () => {
        const mockResponse = {
            data: [],
            pagination: { total_pages: 0 },
        };

        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(createMockResponse(mockResponse));

        const filters = {
            page: 1,
            per_page: 50,
            search: "beatles",
            type: "performer",
            letter: "B",
            include_image: true,
        };

        await ArtistService.getArtists(filters);

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("search=beatles"), expect.any(Object));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("type=performer"), expect.any(Object));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("letter=B"), expect.any(Object));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining("include_image=true"), expect.any(Object));
    });

    it("should handle API errors", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(createMockResponse(null, false, 500));

        const filters = { page: 1, per_page: 50 };

        await expect(ArtistService.getArtists(filters)).rejects.toThrow("HTTP error! Status: 500");
    });

    it("should handle 404 errors", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(createMockResponse(null, false, 404));

        const filters = { page: 1, per_page: 50 };

        await expect(ArtistService.getArtists(filters)).rejects.toThrow("HTTP error! Status: 404");
    });

    it("should handle invalid response structure", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(createMockResponse({}));

        const filters = { page: 1, per_page: 50 };

        await expect(ArtistService.getArtists(filters)).rejects.toThrow("Invalid API response structure");
    });

    it("should handle response without data property", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
            createMockResponse({ pagination: { total_pages: 1 } }),
        );

        const filters = { page: 1, per_page: 50 };

        await expect(ArtistService.getArtists(filters)).rejects.toThrow("Invalid API response structure");
    });

    it("should include cache headers in request", async () => {
        const mockResponse = {
            data: [],
            pagination: { total_pages: 0 },
        };

        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(createMockResponse(mockResponse));

        const filters = { page: 1, per_page: 50 };

        await ArtistService.getArtists(filters);

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
                }),
                cache: "default",
            }),
        );
    });

    it("should handle network errors", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error("Network error"));

        const filters = { page: 1, per_page: 50 };

        await expect(ArtistService.getArtists(filters)).rejects.toThrow("Network error");
    });

    it("should handle JSON parsing errors", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
            ...createMockResponse({}),
            json: () => Promise.reject(new Error("Invalid JSON")),
        } as Response);

        const filters = { page: 1, per_page: 50 };

        await expect(ArtistService.getArtists(filters)).rejects.toThrow("Invalid JSON");
    });
});
