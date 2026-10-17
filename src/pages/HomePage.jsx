import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import AnimatedCharacter from '../components/AnimatedCharacter.jsx';
import ArtworkPreview from '../components/ArtworkPreview.jsx';
import Button from '../components/Button.jsx';
import CharacterGallery from '../components/CharacterGallery.jsx';
import Logo from '../components/Logo.jsx';
import { CHARACTERS, getCharacter } from '../data/characters.js';
import { useApp } from '../hooks/AppContext.jsx';

/** A character that dances on the home page so children see what's coming. */
function HeroDancer() {
  const { reducedMotion } = useApp();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % CHARACTERS.length), 4200);
    return () => clearInterval(id);
  }, [reducedMotion]);
  const character = CHARACTERS[index];
  return (
    <div className="hero-dancer" style={{ '--tint': character.theme.tint }} aria-hidden="true">
      <AnimatedCharacter key={character.id} character={character} dancing={!reducedMotion} />
    </div>
  );
}

export default function HomePage({ navigate }) {
  const { creations } = useApp();
  const recent = creations.slice(0, 4);

  return (
    <AppShell
      tone="home"
      left={<Logo size="sm" />}
      right={
        <Button variant="ghost" icon="lock" onClick={() => navigate('/parent')}>
          Grown-ups
        </Button>
      }
    >
      <section className="hero">
        <HeroDancer />
        <div className="hero-copy">
          <h1 className="hero-title">
            <Logo size="lg" />
          </h1>
          <p className="hero-welcome">Hi friend! Pick a picture, color it, then sing and watch it dance.</p>
          <Button variant="primary" size="lg" icon="star" className="hero-cta" onClick={() => navigate('/pick')}>
            Let’s Create!
          </Button>
        </div>
      </section>

      <section className="section" aria-labelledby="friends-title">
        <h2 id="friends-title" className="section-title">
          Our friends
        </h2>
        <CharacterGallery size="sm" onPick={(c) => navigate(`/color/${c.id}`)} />
      </section>

      <section className="section" aria-labelledby="mine-title">
        <div className="section-head">
          <h2 id="mine-title" className="section-title">
            My Creations
          </h2>
          <Button variant="soft" icon="gallery" onClick={() => navigate('/creations')}>
            See all
          </Button>
        </div>
        {recent.length === 0 ? (
          <p className="empty-line">Your colored pictures will show up here.</p>
        ) : (
          <ul className="recent">
            {recent.map((creation) => {
              const character = getCharacter(creation.characterId);
              return (
                <li key={creation.id}>
                  <button type="button" className="recent-card" onClick={() => navigate('/creations')} aria-label={`Open My Creations. ${character.name}`}>
                    <ArtworkPreview character={character} doc={creation} />
                    <span>{character.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
