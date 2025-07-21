
export interface Video {
    id: number;
    title: string;
    embedUrl: string;
    views: string;
    duration: string;
    category: string;
    rating: number; // 1-5 stars
    uploadDate: string; // ISO date string
    tags: string[];
}

export interface Category {
    id: string;
    name: string;
    description: string;
    videoCount: number;
}

export interface AffiliateBanner {
    id: number;
    link: string;
    imageUrl: string;
    alt: string;
}
