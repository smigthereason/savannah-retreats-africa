export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

import StudioLoader from "./StudioLoader";

export default function StudioPage() {
  return <StudioLoader />;
}
