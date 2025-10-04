import { TArtistResponse } from "../types/artist";

export interface ArtistFilters {
    page: number;
    per_page: number;
    search?: string;
    type?: string;
    letter?: string;
    include_image?: boolean;
}

export class ArtistService {
    private static baseUrl: string;

    static {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        if (!this.baseUrl) {
            throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is not set");
        }
    }

    static async getArtists(filters: ArtistFilters): Promise<TArtistResponse> {
        const params = new URLSearchParams();
        params.append("page", filters.page.toString());
        params.append("per_page", filters.per_page.toString());

        if (filters.search) params.append("search", filters.search);
        if (filters.type) params.append("type", filters.type);
        if (filters.letter) params.append("letter", filters.letter);
        if (filters.include_image) params.append("include_image", "true");

        const url = `${this.baseUrl}/api/artists?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
            },
            cache: "default",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: TArtistResponse = await response.json();

        if (!data || !data.data) {
            throw new Error("Invalid API response structure");
        }

        return data;
    }
}
