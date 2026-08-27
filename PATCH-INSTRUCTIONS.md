# Savannah Retreats Africa — Gallery + FAQ Patch

This archive is **not the full project**. It contains only the files required for the Gallery, Sanity media schema, FAQ page, navigation/footer link changes, and sitemap/image configuration.

## What this patch adds

- `/gallery` page with a responsive masonry image grid.
- Sanity `Gallery Media` schema supporting both image and video uploads.
- Gallery reads only image entries marked for website display.
- Video uploads are stored for later placement and can be tagged as portrait/mobile, landscape/desktop, or square.
- `/faq` page with Safety & Security, Planning, and On Safari questions.
- Direct safety FAQ wording, including the kidnapping/security question, without promising zero risk.
- `Gallery` link in the main navigation.
- `FAQ` link in the footer immediately after Contact and before Engage With Us.
- Gallery and FAQ routes added to the sitemap.
- `cdn.sanity.io` added to Next.js image hosts so Sanity images render through `next/image`.

## Files in the patch

### New files

- `app/(root)/gallery/page.tsx`
- `app/(root)/faq/page.tsx`
- `components/Gallery/GalleryMasonry.tsx`
- `components/FAQ/FAQAccordion.tsx`
- `lib/sanity/gallery.ts`
- `lib/faq-data.ts`
- `sanity/schemaTypes/galleryMedia.ts`

### Existing files replaced by this patch

- `sanity/schemaTypes/index.ts`
- `lib/data.ts`
- `components/Landing-Page/Footer.tsx`
- `next.config.mjs`
- `app/sitemap.ts`

No package dependency changes are required.

## Apply the patch

From the root of your existing `savannah-retreats-africa` project, run:

```bash
unzip -o /path/to/savannah-gallery-faq-patch.zip -d .
```

The archive already has the correct project-relative folder structure. Do **not** move the files into a separate source folder after extracting.

Then start the site normally:

```bash
npm run dev
```

Check:

- `http://localhost:3000/gallery`
- `http://localhost:3000/faq`
- Navbar contains `Gallery`.
- Footer order ends with `Contact`, `FAQ`, then `Engage With Us →`.

## Make Gallery Media appear in Sanity

The code registers a new Sanity document type called **Gallery Media**.

If you use the hosted Sanity Studio shown at `sanity.io`, deploy the updated Studio/schema from the project root:

```bash
npx sanity deploy
```

If your active Studio is the embedded Next.js Studio at `/studio`, redeploy/restart the Next.js app instead.

After the schema is live, open **Gallery Media** and create entries.

### For an image

1. Title — required.
2. Media type — `Image`.
3. Upload the image.
4. Add alternative text where possible.
5. Optionally add caption and location.
6. Leave **Show in website gallery** enabled.
7. Optionally set Sort order; lower numbers appear first.

The `/gallery` page will fetch those image records automatically. It revalidates roughly every 60 seconds.

### For a video

1. Title — required.
2. Media type — `Video`.
3. Upload `.MP4`, `.MOV`, or `.WEBM`.
4. Choose orientation: Portrait / mobile, Landscape / desktop, or Square.
5. Add caption/location if useful.

Videos are intentionally **not rendered on `/gallery` yet**. This prevents us from committing portrait footage to the wrong page before the mobile video experience is decided. The schema keeps the footage ready for a later mobile hero, reel/story section, or other component.

## Note about the current Site-Images folder

Your `.JPG`, `.JPEG`, and `.PNG` files are suitable for the image workflow. Your `.MOV` and `.MP4` files are accepted by the video field.

The two `.HEIC` files may need conversion to JPEG before Sanity upload depending on browser/Studio support. On macOS:

```bash
sips -s format jpeg IMG_7798.HEIC --out IMG_7798.jpg
sips -s format jpeg IMG_7803.HEIC --out IMG_7803.jpg
```

## Deliberately not included

- No full-project replacement.
- No redesign of existing pages.
- No new npm packages.
- No video section added to an arbitrary page.
- No bulk media importer yet.
