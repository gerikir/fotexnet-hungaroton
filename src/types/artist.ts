export interface TArtist {
    id: string;
    name: string;
    albumCount: number;
    portrait?: string;
}

export interface ArtistResponse {
    data: TArtist[];
    pagination: {
        current_page: number;
        total_pages: number;
        per_page: number;
        total_items: number;
    };
}

export interface SearchParams {
    page: number;
    search: string;
    type: string;
    letter: string;
    showAlbumCover: boolean;
}
