import { useEffect } from 'react';
import { APP_NAME } from './config.js';
import { getCharacter } from './data/characters.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import ColoringPage from './pages/ColoringPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MyCreationsPage from './pages/MyCreationsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ParentArea from './pages/ParentArea.jsx';
import PerformancePage from './pages/PerformancePage.jsx';
import PickPage from './pages/PickPage.jsx';
import RhymePage from './pages/RhymePage.jsx';
import { stopAllAudio } from './utils/audio.js';

export default function App() {
  const { path, query, navigate } = useHashRoute();
  const [, section, id] = path.split('/');

  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  // New screen: start at the top and make sure nothing is still talking or playing.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (section !== 'perform') stopAllAudio();
  }, [path, section]);

  const character = getCharacter(id);

  switch (section || 'home') {
    case 'home':
      return <HomePage navigate={navigate} />;
    case 'pick':
      return <PickPage navigate={navigate} />;
    case 'creations':
      return <MyCreationsPage navigate={navigate} />;
    case 'parent':
      return <ParentArea navigate={navigate} />;
    case 'color':
      return character ? <ColoringPage key={character.id} character={character} navigate={navigate} /> : <NotFoundPage navigate={navigate} />;
    case 'rhyme':
      return character ? <RhymePage key={character.id} character={character} navigate={navigate} /> : <NotFoundPage navigate={navigate} />;
    case 'perform':
      return character ? (
        <PerformancePage key={`${character.id}-${query.demo ? 'demo' : 'rec'}`} character={character} demo={Boolean(query.demo)} navigate={navigate} />
      ) : (
        <NotFoundPage navigate={navigate} />
      );
    default:
      return <NotFoundPage navigate={navigate} />;
  }
}
