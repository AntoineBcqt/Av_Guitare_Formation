import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import logoUrl from '../../assets/logo.svg';
import styles from './PublicNavbar.module.css';

const navItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Packs', to: '/cours' },
  { label: 'Qui suis-je ?', to: '/#professor' },
  { label: 'Cours physique', to: '/#physique' },
  { label: 'FAQ', to: '/#faq' },
];

export function PublicNavbar() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={logoUrl} alt="AV Guitare Formation" className={styles.logoImg} />
        </Link>

        <nav className={[styles.nav, menuOpen ? styles.open : ''].filter(Boolean).join(' ')}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [styles.navLink, isActive && item.to !== '/#professor' && item.to !== '/#physique' && item.to !== '/#faq' ? styles.active : ''].filter(Boolean).join(' ')
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          {isAuthenticated ? (
            <button className={styles.ctaBtn} onClick={() => navigate('/mon-espace')}>
              Mon espace
            </button>
          ) : (
            <Link to="/login" className={styles.ctaBtn}>
              Connexion
            </Link>
          )}
          <button
            className={styles.burger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
