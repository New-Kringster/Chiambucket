'use client';
import DrumNetFilm from './DrumNetFilm';

/* The DrumNet chapter: the film alone, with no cover, so it follows straight on
   from the 3D chapter's capture. The film (DrumNetFilm.tsx, film/scenes.ts)
   opens on the very photo the reader just took, full-bleed, then animates the
   whole V10 architecture on one map, from the capture down to the reading, with
   every number and map from one real run (drumnet-data.ts,
   public/images/waterslop/dn/). */
export default function DrumNetStory({ chapter }: { chapter: string }) {
  return <DrumNetFilm chapter={chapter} />;
}
