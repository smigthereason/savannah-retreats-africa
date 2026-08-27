import { client } from "./client";

export type GalleryImage = {
  _id: string;
  title: string;
  altText?: string;
  caption?: string;
  location?: string;
  image: {
    asset: {
      url: string;
      metadata?: {
        dimensions?: {
          width?: number;
          height?: number;
          aspectRatio?: number;
        };
        lqip?: string;
      };
    };
  };
};

const galleryImagesQuery = `
  *[
    _type == "galleryMedia" &&
    mediaType == "image" &&
    showInGallery != false &&
    defined(image.asset)
  ] | order(sortOrder asc, _createdAt desc) {
    _id,
    title,
    altText,
    caption,
    location,
    image {
      asset-> {
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          },
          lqip
        }
      }
    }
  }
`;

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return client.fetch<GalleryImage[]>(galleryImagesQuery);
}
