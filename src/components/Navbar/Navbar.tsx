import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import { useAuthContext } from '../../contexts/AuthContext';
import logoUrl from '../../assets/logo.svg';
import styles from './Navbar.module.css';

interface NavbarProps {
  user: User | null;
}

const guestNavItems = [{ label: 'Cours', to: '/cours' }];

const authNavItems = [
  { label: 'Mon Espace', to: '/mon-espace' },
  { label: 'Cours', to: '/cours' },
  { label: 'Communauté', to: '/communaute' },
  { label: 'Messages', to: '/messages' },
];

export function Navbar({ user }: NavbarProps) {
  const { logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navItems = user ? authNavItems : guestNavItems;

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/cours" className={styles.logo}>
          <img src={logoUrl} alt="AV Guitare Formation" className={styles.logoImg} />
        </NavLink>

        <nav className={[styles.nav, mobileOpen ? styles.navOpen : ''].filter(Boolean).join(' ')}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
          {!user && (
            <div className={styles.mobileGuestActions}>
              <Link to="/login" className={styles.loginLink} onClick={() => setMobileOpen(false)}>Se connecter</Link>
              <Link to="/register" className={styles.registerLink} onClick={() => setMobileOpen(false)}>S'inscrire</Link>
            </div>
          )}
        </nav>

        <div className={styles.right} ref={dropdownRef}>
          <button
            className={[styles.burgerBtn, mobileOpen ? styles.burgerOpen : ''].filter(Boolean).join(' ')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu navigation"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>

          {user ? (
            <>
              <button
                className={[styles.avatarBtn, dropdownOpen ? styles.open : ''].filter(Boolean).join(' ')}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Menu utilisateur"
              >
                <Avatar initials={user.initials} size={38} />
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { setDropdownOpen(false); navigate('/profil'); }}
                  >
                    Mon profil
                  </button>
                  <button
                    className={[styles.dropdownItem, styles.danger].join(' ')}
                    onClick={() => { setDropdownOpen(false); logout(); navigate('/cours'); }}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.guestActions}>
              <Link to="/login" className={styles.loginLink}>Se connecter</Link>
              <Link to="/register" className={styles.registerLink}>S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
