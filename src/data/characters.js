// All character content lives here, separate from UI code.
// To add a character: create src/artwork/<name>.js, then add one entry below.
// (See README: "Adding a new character and rhyme".)
import { dinoArt } from '../artwork/dino.js';
import { butterflyArt } from '../artwork/butterfly.js';
import { elephantArt } from '../artwork/elephant.js';
import { rocketArt } from '../artwork/rocket.js';
import { carArt } from '../artwork/car.js';

/*
 * Character shape:
 *  id          unique, URL-safe
 *  name        shown to children
 *  art         { regions, details }  - coloring artwork AND animated character source
 *  rhyme       { title, lines[] }    - original lyrics
 *  animation   { type, beat, ... }   - `type` picks the CSS in animations/characters.css
 *  theme       { sky[2], tint, scenery } - backgrounds
 */
export const CHARACTERS = [
  {
    id: 'dino',
    name: 'Dino',
    art: dinoArt,
    rhyme: {
      title: 'Dino Dance',
      lines: [
        'Dino, dino, green and bright,',
        'Stomp your feet to the left and right!',
        'Swing your tail and give a cheer,',
        'Dancing dino, dance right here!',
      ],
    },
    animation: { type: 'dino', beat: '0.8s' },
    theme: { sky: ['#d9f5e8', '#bfe3ff'], tint: '#e8f8ef', scenery: 'hills' },
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    art: butterflyArt,
    rhyme: {
      title: 'Flutter Wings',
      lines: [
        'Flutter, flutter, wings so wide,',
        'Float up high and swoop and glide!',
        'Dancing colors in the sun,',
        'Butterfly, come join the fun!',
      ],
    },
    animation: { type: 'butterfly', beat: '0.7s' },
    theme: { sky: ['#f3dcff', '#ffe4f1'], tint: '#f6e9ff', scenery: 'meadow' },
  },
  {
    id: 'elephant',
    name: 'Elephant',
    art: elephantArt,
    rhyme: {
      title: 'Elephant Parade',
      lines: [
        'Elephant, elephant, big and sweet,',
        'Swing your trunk and stomp your feet!',
        'Flap your ears and sway side to side,',
        'Happy elephant, dance with pride!',
      ],
    },
    animation: { type: 'elephant', beat: '1s' },
    theme: { sky: ['#fff1cf', '#ffd9c2'], tint: '#fff3dc', scenery: 'savanna' },
  },
  {
    id: 'rocket',
    name: 'Rocket',
    art: rocketArt,
    rhyme: {
      title: 'Rocket Countdown',
      lines: [
        'Rocket, rocket, shiny and red,',
        'Zoom up high above my head!',
        'Count with me: three, two, one, go!',
        'Twinkle stars all in a row!',
      ],
    },
    animation: { type: 'rocket', beat: '0.9s' },
    theme: { sky: ['#8a93ec', '#d3c2ff'], tint: '#e6e9ff', scenery: 'space' },
  },
  {
    id: 'car',
    name: 'Car',
    art: carArt,
    rhyme: {
      title: 'Beep Beep Car',
      lines: [
        'Little car goes beep, beep, beep,',
        'Rolling down the sunny street!',
        'Wheels go round and round and round,',
        'Happy car makes a happy sound!',
      ],
    },
    animation: { type: 'car', beat: '0.8s' },
    theme: { sky: ['#bfe3ff', '#e8f6ff'], tint: '#e3f2ff', scenery: 'road' },
  },
];

export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || null;
