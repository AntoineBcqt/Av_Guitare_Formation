import { useState } from 'react';
import type { Level } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/Avatar/Avatar';
import styles from './Profile.module.css';

const levels: Level[] = ['Débutant', 'Intermédiaire', 'Avancé'];

export function Profile() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [level, setLevel] = useState<Level>(user.level ?? 'Débutant');
  const [saved, setSaved] = useState(false);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mon profil</h1>
        <p className={styles.pageSub}>Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Informations personnelles</div>

          <div className={styles.avatarSection}>
            <Avatar initials={initials} size={80} />
            <div className={styles.avatarLabel}>{firstName} {lastName}</div>
            <div className={styles.avatarSub}>Élève · {level}</div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Prénom</label>
              <input
                className={styles.formInput}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Nom</label>
              <input
                className={styles.formInput}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Email</label>
            <input
              className={styles.formInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Niveau de pratique</label>
            <div className={styles.levelPills}>
              {levels.map((l) => (
                <button
                  key={l}
                  className={[styles.levelPill, level === l ? styles.active : ''].filter(Boolean).join(' ')}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.saveBtn} onClick={handleSave}>
            Enregistrer les modifications
          </button>
          {saved && <p className={styles.savedMsg}>✓ Modifications enregistrées</p>}
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Sécurité</div>
          <p className={styles.securityNote}>
            Choisissez un mot de passe fort d'au moins 8 caractères.
          </p>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Mot de passe actuel</label>
            <input
              className={styles.formInput}
              type="password"
              placeholder="••••••••"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Nouveau mot de passe</label>
            <input
              className={styles.formInput}
              type="password"
              placeholder="••••••••"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Confirmer le nouveau mot de passe</label>
            <input
              className={styles.formInput}
              type="password"
              placeholder="••••••••"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </div>

          <button className={styles.saveBtn}>
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}
