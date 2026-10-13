import AppShell from '../components/AppShell.jsx';
import Button from '../components/Button.jsx';

export default function NotFoundPage({ navigate }) {
  return (
    <AppShell tone="home" title="Oops!">
      <div className="empty">
        <p className="lead">We couldn’t find that page.</p>
        <Button variant="primary" size="lg" icon="home" onClick={() => navigate('/')}>
          Go home
        </Button>
      </div>
    </AppShell>
  );
}
