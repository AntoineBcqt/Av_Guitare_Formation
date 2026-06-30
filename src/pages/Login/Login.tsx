import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import logoUrl from '../../assets/logo.svg';
import styles from './Login.module.css';

const FEATURES = [
  'Reprise automatique sur la dernière leçon',
  'Suivi de progression sur chaque parcours',
  'Accès à la messagerie avec votre professeur',
  'Historique des partitions téléchargées',
];

export function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'teacher' ? '/professeur/dashboard' : '/mon-espace', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Navbar minimale */}
      <header className={styles.navbar}>
        <Link to="/">
          <img src={logoUrl} alt="AV Guitare Formation" className={styles.navLogo} />
        </Link>
        <Link to="/register" className={styles.navLink}>J'ai déjà un compte</Link>
      </header>

      <div className={styles.split}>
        {/* ── Gauche : formulaire ── */}
        <div className={styles.left}>
          <div className={styles.formWrap}>
            <div className={styles.eyebrow}>Connexion</div>
            <h1 className={styles.title}>
              Bon retour<br />parmi nous
            </h1>
            <p className={styles.subtitle}>Connectez-vous pour reprendre votre parcours.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Adresse email</label>
                <input
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="exemple@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Mot de passe</label>
                <input
                  className={styles.input}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className={styles.forgotBtn}>
                  Mot de passe oublié ?
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button className={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            <div className={styles.divider}>
              <span />
              <span className={styles.dividerText}>Pas encore de compte ?</span>
              <span />
            </div>

            <Link to="/register" className={styles.registerBtn}>
              Créer votre compte
            </Link>

            <p className={styles.legal}>
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className={styles.legalLink}>conditions d'utilisation</a>
            </p>
          </div>
        </div>

        {/* ── Droite : panel navy ── */}
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <h2 className={styles.rightTitle}>
              Reprenez exactement<br />
              <em className={styles.rightTitleItalic}>où vous étiez</em>
            </h2>
            <p className={styles.rightSub}>
              Votre progression est sauvegardée. Vos partitions, exercices, votre dernière leçon.
            </p>
            <ul className={styles.featureList}>
              {FEATURES.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <span className={styles.featureDot} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
