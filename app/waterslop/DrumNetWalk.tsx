'use client';
import { Cover, Plate } from './Story';
import DrumNetFilm from './DrumNetFilm';

/* The DrumNet chapter: a cover, then the film. The film (DrumNetFilm.tsx,
   film/scenes.ts) animates the whole V10 architecture on one map, from the
   capture down to the reading, with every number and map from one real run
   (drumnet-data.ts, public/images/waterslop/dn/). */
export default function DrumNetStory({ chapter }: { chapter: string }) {
  return (
    <>
      <Cover id="drumnet" chapter={chapter} title="DrumNet" lines={['DrumNet', 'V10']}
        contents={[{ label: 'Spotter: a rough box' }, { label: 'Refiner: the four edges, twice' }, { label: 'Cut into six drums' }, { label: 'Three readers, a vote' }, { label: 'The carry rule, the reading' }]}
        plate={<Plate srcs={['dn/photo.webp', 'dn/cut-win.webp', 'dn/rd-window.webp']} alt="The capture DrumNet reads, with the window it finds and the drums it cuts" />} />
      <DrumNetFilm chapter={chapter} />
    </>
  );
}
