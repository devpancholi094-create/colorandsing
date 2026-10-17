// All character content lives here, separate from UI code.
// To add a character: create src/artwork/<name>.js, then add one entry below.
// (See README: "Adding a new character and rhyme".)
import { dinoArt } from '../artwork/dino.js';
import { butterflyArt } from '../artwork/butterfly.js';
import { elephantArt } from '../artwork/elephant.js';
import { rocketArt } from '../artwork/rocket.js';
import { carArt } from '../artwork/car.js';
import { fishArt } from '../artwork/fish.js';
import { catArt } from '../artwork/cat.js';
import { duckArt } from '../artwork/duck.js';
import { flowerArt } from '../artwork/flower.js';
import { boatArt } from '../artwork/boat.js';

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
    animation: { type: 'rocket', beat: '0.9s', extra: 'trail' },
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
  {
    id: 'fish',
    name: 'Fish',
    art: fishArt,
    rhyme: {
      title: 'Splashy Fish',
      lines: [
        'Little fish, little fish, swish and swim,',
        'Splash and wiggle, fin to fin!',
        'Bubbles pop up, one, two, three,',
        'Dancing fish in the deep blue sea!',
      ],
    },
    animation: { type: 'fish', beat: '0.9s', extra: 'bubbles' },
    theme: { sky: ['#bfeaff', '#8fd3f5'], tint: '#e0f4ff', scenery: 'underwater' },
  },
  {
    id: 'cat',
    name: 'Cat',
    art: catArt,
    rhyme: {
      title: 'Kitty Cat Dance',
      lines: [
        'Kitty cat, kitty cat, soft and sweet,',
        'Tap your paws and tap your feet!',
        'Swish your tail and twirl with me,',
        'Purr and dance so happily!',
      ],
    },
    animation: { type: 'cat', beat: '0.9s' },
    theme: { sky: ['#ffe3ee', '#fff3e0'], tint: '#ffeedd', scenery: 'room' },
  },
  {
    id: 'duck',
    name: 'Duck',
    art: duckArt,
    rhyme: {
      title: 'Waddle Duck',
      lines: [
        'Little duck, little duck, quack, quack, quack,',
        'Waddle forward, waddle back!',
        'Flap your wings and splash about,',
        'Happy duck, give a shout!',
      ],
    },
    animation: { type: 'duck', beat: '0.8s', extra: 'bubbles' },
    theme: { sky: ['#d9f2ff', '#e8f8e0'], tint: '#fff6cf', scenery: 'pond' },
  },
  {
    id: 'flower',
    name: 'Flower',
    art: flowerArt,
    rhyme: {
      title: 'Blooming Flower',
      lines: [
        'Little flower, tall and bright,',
        'Open up to the sunny light!',
        'Sway and dance in the gentle breeze,',
        'Spin your petals, if you please!',
      ],
    },
    animation: { type: 'flower', beat: '1.1s', extra: 'petals' },
    theme: { sky: ['#e8f7ff', '#fff7d6'], tint: '#fff0f5', scenery: 'garden' },
  },
  {
    id: 'boat',
    name: 'Sailboat',
    art: boatArt,
    rhyme: {
      title: 'Sailing Song',
      lines: [
        'Little boat on the ocean blue,',
        'Rock and roll, and sail on through!',
        'Wind in the sails, the waves go splash,',
        'Sailing, sailing, dash, dash, dash!',
      ],
    },
    animation: { type: 'boat', beat: '1s', extra: 'bubbles' },
    theme: { sky: ['#cdeeff', '#fff3d6'], tint: '#e0f0ff', scenery: 'sea' },
  },
];

export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || null;
