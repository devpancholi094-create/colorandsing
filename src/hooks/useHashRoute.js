import { useCallback, useEffect, useState } from 'react';

// Tiny hash router (#/color/dino?x=1). Hash routes need no server rewrites, so the
// app works on Vercel, GitHub Pages, or from any folder, and the browser Back button works.
function readRoute() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return { path, query: Object.fromEntries(new URLSearchParams(queryPart)) };
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) {
      window.location.replace(`${window.location.pathname}${window.location.search}#${to}`);
    } else {
      window.location.hash = to;
    }
  }, []);

  return { ...route, navigate };
}
