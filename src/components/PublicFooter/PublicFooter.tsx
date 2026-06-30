import { Link } from 'react-router-dom';
import logoUrl from '../../assets/logo.svg';
import styles from './PublicFooter.module.css';

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src={logoUrl} alt="AV Guitare Formation" className={styles.logo} />
          <p className={styles.brandDesc}>
            Une formation en ligne pour apprendre la guitare.<br />
            Méthode par Alexandre Vanthournout.
          </p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={styles.colTitle}>Ressources</div>
            <Link to="/cours" className={styles.colLink}>Catalogue complet</Link>
            <a href="#faq" className={styles.colLink}>FAQ</a>
            <Link to="/cours" className={styles.colLink}>Tarifs</Link>
          </div>
          <div className={styles.col}>
            <div className={styles.colTitle}>Compte</div>
            <Link to="/login" className={styles.colLink}>Connexion</Link>
            <Link to="/register" className={styles.colLink}>Créer un compte</Link>
            <Link to="/mon-espace" className={styles.colLink}>Plateforme de cours</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 AV Guitare Formation · Tous droits réservés</span>
        <div className={styles.legal}>
          <a href="#" className={styles.legalLink}>Mentions légales</a>
          <a href="#" className={styles.legalLink}>CGU</a>
          <a href="#" className={styles.legalLink}>CGV</a>
          <a href="#" className={styles.legalLink}>Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  );
}
