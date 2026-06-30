import { useAuthContext } from '../../contexts/AuthContext';
import { Navbar } from '../../components/Navbar/Navbar';
import { PublicNavbar } from '../../components/PublicNavbar/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter/PublicFooter';
import { Catalogue } from './Catalogue';

export function PublicCatalogue() {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} />
        <main style={{ flex: 1 }}>
          <Catalogue />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <div style={{ flex: 1 }}>
        <Catalogue />
      </div>
      <PublicFooter />
    </div>
  );
}
