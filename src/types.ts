export interface CarouselImages {
  lecturer: string[];
  studentDesktop: string[];
  studentMobile: string[];
  titles?: {
    lecturer?: string[];
    studentDesktop?: string[];
    studentMobile?: string[];
  };
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  thumbnailImages?: string[];
  galleryImages?: string[];
  carouselImages?: CarouselImages;
  gifUrl?: string;
  videoUrl?: string;
  year: string;
  role: string;
  tags: string[];
}
