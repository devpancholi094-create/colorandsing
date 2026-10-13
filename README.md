# Color & Sing

A free, private coloring, singing and dancing-character web app for children (about ages 3 to 5).

1. Pick a friend (dino, butterfly, elephant, rocket or car).
2. Color the drawing with a brush, fill bucket and eraser (touch, mouse or stylus).
3. Read or listen to a short original rhyme.
4. Sing it into the microphone. The child's own recorded voice is played back.
5. Watch the colored character dance while the recording plays.

**No AI, no backend, no accounts, no analytics, no paid services, no API keys.** Everything runs in the browser.

## Install and run

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # local dev server (http://localhost:5173)
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally (http://localhost:4173)
```

Assets use relative paths (`base: './'`) and routing uses the URL hash (`#/color/dino`), so the build works on Vercel, GitHub Pages or any static host without rewrite rules.

## Upload to GitHub

```bash
git init
git add .
git commit -m "Color & Sing"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

(`node_modules/` and `dist/` are already in `.gitignore`.)

## Deploy on Vercel

1. Sign in at vercel.com and choose **Add New... > Project**.
2. Import the GitHub repository.
3. Vercel detects **Vite** automatically (build command `npm run build`, output directory `dist`). No environment variables and no `vercel.json` are needed.
4. Click **Deploy**. Vercel serves over HTTPS, which browsers require for microphone access.

## Testing the microphone

- Microphone access only works on `https://` pages or `http://localhost`.
- Open the app, choose a friend, tap **Done Coloring!**, then **Let Me Sing!** and **Okay, let's sing!**. The browser asks for permission only at that point.
- Try these cases:
  - **Allow**: you should see a red recording indicator and timer; **Stop** ends it; the microphone indicator in the browser tab should turn off immediately.
  - **Block** (or deny): a friendly message appears and **Watch Demo** still works. To re-enable, open the browser's site settings for the page, set Microphone to Allow, and reload.
  - **30 seconds**: recording stops by itself at 0:30.
  - Leave the screen mid-recording: the microphone is released.
- No recording is ever saved to storage or uploaded. It lives in memory and is released when you delete it, re-record, or close/reload the page.
- Quick desktop test without a real microphone: start Chrome with `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`.

## Renaming the app

Change `APP_NAME` and `APP_TAGLINE` in `src/config.js`, and the `<title>` in `index.html`. The logo and page title follow automatically.

## Adding a new character and rhyme

1. Create `src/artwork/<name>.js` exporting `{ regions, details }` in a 400 x 400 coordinate box (see `dino.js` for a model).
   - `regions` are listed back to front. Each has an `id`, a `label`, a path `d`, a `fill` (its default character color) and a `group` (the animated body part).
   - Each region is both a fillable area on the coloring page and a body part on the animated character, so the child's colors map automatically.
   - `details` are fixed lines/dots placed just after the region named in `after`. Add `animatedOnly: true` for decoration that should only appear on the dancing character (cheeks, shines).
   - Helpers in `src/artwork/shapes.js`: `circle`, `ellipse`, `roundRect`, `mirror` (for symmetric art).
2. Add an entry to `CHARACTERS` in `src/data/characters.js`: `id`, `name`, `art`, `rhyme: { title, lines }`, `animation: { type, beat }`, `theme: { sky, tint, scenery }`.
3. Add dance moves in `src/animations/characters.css` under `.char-<type>.is-dancing`, targeting your groups as `.g-<group>`. Use `var(--beat)` for timing and `var(--amp)` to size movements (it shrinks automatically in gentle-motion mode).
4. For a new `scenery` name, add a scene in `src/components/Backdrop.jsx` (or reuse an existing one).

## Project structure

```
src/
  artwork/       original SVG artwork (one file per character) + path helpers
  data/          characters (rhymes, themes, animation config) and the color palette
  components/    AppShell, ColoringCanvas, SVGColoringArtwork, ColorPalette, DrawingToolbar,
                 RecordingControls, AnimatedCharacter, StageEffects, Backdrop, Confetti,
                 CharacterGallery, ArtworkPreview, ConfirmationDialog, ...
  pages/         Home, Pick, Coloring, Rhyme, Performance, MyCreations, ParentArea
  hooks/         app state (context), coloring undo/redo sessions, recorder, hash router
  animations/    character dance CSS keyframes
  utils/         audio (one-sound-at-a-time), stroke drawing, storage + validation
  styles/        global, page and stage CSS
```

## Privacy design

- The parent area explains this in plain language. There is a simple arithmetic "grown-ups only" check. It is a speed bump for small children, **not** a security lock.
- Saved pictures (colors and brush strokes) are stored in this browser's `localStorage` only. Settings and a "has danced" star per friend are stored too. Nothing else is stored.
- Saved data is validated on load; unknown or corrupted entries are dropped instead of crashing the app.
- Reading the rhyme aloud uses the device's built-in text-to-speech when available. It is never presented as the child's voice. If unavailable, the rhyme is displayed for a grown-up to read.

## Known limitations and browser notes

- **Recording formats vary:** Chrome/Edge/Firefox record WebM or Ogg; Safari records MP4/AAC. Very old browsers may lack `MediaRecorder`; the app then explains this and the demo still works.
- **Autoplay rules:** if a browser refuses to start audio automatically on the performance screen (Safari sometimes does), a big **Start the show!** button appears.
- **Read-aloud voice** quality and availability depend on the device. It is hidden when unsupported.
- **Brush strokes on the dancing character** are carried over as a picture clipped to each body part. They move with that part but do not change shape. Region colors map exactly.
- **Keyboard:** all buttons are keyboard accessible, but filling regions of the picture itself needs a pointer (touch, mouse or stylus).
- Up to 24 saved pictures; saving is refused with a friendly message if browser storage is full or blocked.
- Private/incognito windows may block `localStorage`; the app still works but cannot save.

## What was tested

Automated end-to-end checks were run against the production build (`npm run preview`) in headless Chromium with a fake microphone, covering: fill / brush / eraser / undo / redo / clear-with-confirmation, touch and mouse input, saving and reload persistence, the full Home to Dance flow, recording and playback, microphone tracks stopping, no audio overlap, denied / missing / unsupported microphone, the 30-second limit, corrupted storage, the parent area, reduced motion, and layouts from 320px to 1280px wide. **Not tested:** Safari/iOS, real touch hardware or stylus, real text-to-speech voices, and a live Vercel deployment.
