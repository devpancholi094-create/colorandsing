import AppShell from '../components/AppShell.jsx';
import CharacterGallery from '../components/CharacterGallery.jsx';

export default function PickPage({ navigate }) {
  return (
    <AppShell tone="home" title="Pick a friend" onBack={() => navigate('/')} backLabel="Home">
      <p className="lead">Who do you want to color?</p>
      <CharacterGallery size="lg" onPick={(c) => navigate(`/color/${c.id}`)} />
    </AppShell>
  );
}
