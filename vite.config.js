import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps every asset path relative, so the build works on Vercel,
// GitHub Pages, or when opened from any sub-folder.
export default defineConfig({
  base: './',
  plugins: [react()],
});
