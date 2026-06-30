import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import logoUrl from '../../assets/logo.svg';
import styles from './Register.module.css';

export function Register() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleStep1(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError('Veuillez renseigner votre prénom et votre nom.');
      return;
    }
    setStep(2);
  }

  async function handleStep2(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, firstName, lastName);
      navigate('/mon-espace', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
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
        <Link to="/login" className={styles.navLink}>J'ai déjà un compte</Link>
      </header>

      <div className={styles.center}>
        <div className={styles.card}>
          {/* Progress pills */}
          <div className={styles.pills}>
            <span className={step >= 1 ? styles.pillActive : styles.pillDot} />
            <span className={step >= 2 ? styles.pillActive : styles.pillDot} />
          </div>

          {step === 1 ? (
            <>
              <div className={styles.eyebrow}>← Étape 1 sur 2</div>
              <h1 className={styles.title}>
                Comment vous<br />
                <em className={styles.titleItalic}>appelez-vous ?</em>
              </h1>
              <p className={styles.subtitle}>
                Votre prénom personnalisera votre espace d'apprentissage.
              </p>

              <form onSubmit={handleStep1} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Prénom</label>
                  <input
                    className={styles.input}
                    type="text"
                    autoComplete="given-name"
                    placeholder="Alexandre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Nom</label>
                  <input
                    className={styles.input}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Dupont"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.submitBtn} type="submit">
                  Continuer →
                </button>
              </form>
            </>
          ) : (
            <>
              <div className={styles.eyebrow}>← Étape 2 sur 2</div>
              <h1 className={styles.title}>
                Votre espace vous attend,{' '}
                <em className={styles.titleItalic}>{firstName}&nbsp;!</em>
              </h1>
              <p className={styles.subtitle}>
                Plus qu'un instant pour finaliser votre inscription.
              </p>

              <form onSubmit={handleStep2} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Adresse email</label>
                  <input
                    className={styles.input}
                    type="email"
                    autoComplete="email"
                    placeholder="exemple@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Mot de passe</label>
                  <input
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirmation mot de passe</label>
                  <input
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.submitBtn} type="submit" disabled={loading}>
                  {loading ? 'Création…' : 'Créer mon compte →'}
                </button>
              </form>

              <button className={styles.backBtn} onClick={() => setStep(1)}>
                ← Retour
              </button>
            </>
          )}

          <p className={styles.legal}>
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className={styles.legalLink}>conditions d'utilisation</a>
          </p>
        </div>
      </div>
    </div>
  );
}
