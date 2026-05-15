import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import styles from './Navbar.module.css';

interface NavbarProps {
  user: User;
}

const navItems = [
  { label: 'Mon Espace', to: '/mon-espace' },
  { label: 'Cours', to: '/cours' },
  { label: 'Communauté', to: '/communaute' },
  { label: 'Messages', to: '/messages' },
];

export function Navbar({ user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/mon-espace" className={styles.logo}>
          <span className={styles.logoIcon}>🎸</span>
          <span className={styles.logoText}>Guitare Formation</span>
        </NavLink>

        <nav className={styles.nav}>
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
        </nav>

        <div className={styles.right} ref={dropdownRef}>
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
                onClick={() => setDropdownOpen(false)}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
