import AnimatedCharacter from './AnimatedCharacter.jsx';
import Icon from './Icon.jsx';
import { CHARACTERS } from '../data/characters.js';
import { useApp } from '../hooks/AppContext.jsx';

/** Grid of characters to pick from. Used on the home page (small) and the picker (large). */
export default function CharacterGallery({ onPick, size = 'md' }) {
  const { progress } = useApp();
  return (
    <ul className={`gallery gallery-${size}`}>
      {CHARACTERS.map((character) => (
        <li key={character.id}>
          <button
            type="button"
            className="gallery-card"
            style={{ '--tint': character.theme.tint }}
            onClick={() => onPick(character)}
            aria-label={`Color the ${character.name}`}
          >
            <span className="gallery-art">
              <AnimatedCharacter character={character} />
            </span>
            <span className="gallery-name">{character.name}</span>
            {progress.performed[character.id] && (
              <span className="gallery-star" title="This friend has danced!">
                <Icon name="star" size={22} />
                <span className="sr-only">Has danced</span>
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
