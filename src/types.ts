export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  thumbnailImages?: string[];
  galleryImages?: string[];
  gifUrl?: string;
  videoUrl?: string;
  year: string;
  role: string;
  tags: string[];
}
