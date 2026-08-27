import { defineField, defineType } from "sanity";

export const galleryMedia = defineType({
  name: "galleryMedia",
  title: "Gallery Media",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "A short internal/display title for this media item.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      initialValue: "image",
      options: {
        layout: "radio",
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === "image" && !value) {
            return "Upload an image for image media items.";
          }
          return true;
        }),
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: {
        accept: "video/mp4,video/quicktime,video/webm",
      },
      hidden: ({ parent }) => parent?.mediaType !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === "video" && !value) {
            return "Upload a video for video media items.";
          }
          return true;
        }),
    }),
    defineField({
      name: "altText",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the image for accessibility. Keep it concise and factual.",
      hidden: ({ parent }) => parent?.mediaType === "video",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Optional location, lodge, park, or region shown with the media.",
    }),
    defineField({
      name: "showInGallery",
      title: "Show in website gallery",
      type: "boolean",
      description:
        "Images with this enabled appear on /gallery. Videos are stored for future use and are not shown on the gallery page yet.",
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType === "video",
    }),
    defineField({
      name: "videoOrientation",
      title: "Video orientation",
      type: "string",
      description:
        "Helps us decide later where portrait/mobile and landscape videos should be used.",
      options: {
        layout: "radio",
        list: [
          { title: "Portrait / mobile", value: "portrait" },
          { title: "Landscape / desktop", value: "landscape" },
          { title: "Square", value: "square" },
        ],
      },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description:
        "Lower numbers appear first. Leave blank to fall back to newest-first ordering.",
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      mediaType: "mediaType",
      media: "image",
      location: "location",
    },
    prepare({ title, mediaType, media, location }) {
      const typeLabel = mediaType === "video" ? "Video" : "Image";
      return {
        title,
        subtitle: [typeLabel, location].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
