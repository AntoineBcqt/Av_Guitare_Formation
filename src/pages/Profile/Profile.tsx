import { useState } from 'react';
import type { Level } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/Avatar/Avatar';
import styles from './Profile.module.css';

const levels: Level[] = ['Débutant', 'Intermédiaire', 'Avancé'];

export function Profile() {
  const { user } = useAuth();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [level, setLevel] = useState<Level>(user.level ?? 'Débutant');
  const [saved, setSaved] = useState(false);

  const [notifLessons, setNotifLessons] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    logout();
    navigate('/cours');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mon profil</h1>
        <p className={styles.subtitle}>Gérez vos informations, votre sécurité et vos données personnelles.</p>
      </div>

      <div className={styles.stack}>
        {/* Informations personnelles */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Informations personnelles</div>
            <div className={styles.cardSubtitle}>Ces informations sont visibles dans la communauté.</div>
          </div>

          <div className={styles.avatarRow}>
            <Avatar initials={initials} size={56} />
            <div>
              <div className={styles.avatarName}>{firstName} {lastName}</div>
              <div className={styles.avatarRole}>Élève · {level}</div>
            </div>
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
            <label className={styles.formLabel}>Adresse email</label>
            <input
              className={styles.formInputDisabled}
              type="email"
              value={user.email}
              readOnly
            />
            <div className={styles.formHint}>Utilisée pour la connexion et les notifications.</div>
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

        {/* Sécurité */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Sécurité</div>
          <div className={styles.cardSubtitle}>Gérez votre mot de passe et l'accès à votre compte.</div>
          <button className={styles.outlineBtn}>Changer le mot de passe</button>
        </div>

        {/* Notifications */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Notifications</div>
          <div className={styles.cardSubtitle}>Choisissez les communications que vous souhaitez recevoir.</div>

          <div className={styles.toggleList}>
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleLabel}>Nouvelles leçons disponibles</div>
                <div className={styles.toggleDesc}>Soyez informé(e) dès qu'une leçon est publiée.</div>
              </div>
              <button
                className={[styles.toggle, notifLessons ? styles.toggleOn : ''].filter(Boolean).join(' ')}
                onClick={() => setNotifLessons((v) => !v)}
                aria-pressed={notifLessons}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>

            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleLabel}>Messages du professeur</div>
                <div className={styles.toggleDesc}>Recevez une alerte email pour chaque message.</div>
              </div>
              <button
                className={[styles.toggle, notifMessages ? styles.toggleOn : ''].filter(Boolean).join(' ')}
                onClick={() => setNotifMessages((v) => !v)}
                aria-pressed={notifMessages}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>

            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleLabel}>Activité communautaire</div>
                <div className={styles.toggleDesc}>Réponses à vos posts et nouvelles discussions.</div>
              </div>
              <button
                className={[styles.toggle, notifCommunity ? styles.toggleOn : ''].filter(Boolean).join(' ')}
                onClick={() => setNotifCommunity((v) => !v)}
                aria-pressed={notifCommunity}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
          </div>
        </div>

        {/* Données personnelles */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Mes données personnelles</div>
          <div className={styles.cardSubtitle}>Vos droits au titre du RGPD (UE 2016/679) et de la loi Informatique et Libertés.</div>

          <div className={styles.rgpdBlock}>
            <div className={styles.rgpdTitle}>Données traitées</div>
            <ul className={styles.rgpdList}>
              <li>Identité : prénom, nom, adresse email</li>
              <li>Données de navigation : progression, leçons consultées</li>
              <li>Contenus générés : posts, messages</li>
              <li>Données techniques : adresse IP, type de navigateur</li>
            </ul>
            <p className={styles.rgpdLegal}>
              Base légale : exécution du contrat (Art. 6.1.b RGPD) · Consentement pour les communications commerciales (Art. 6.1.a RGPD)<br />
              Durée de conservation : 3 ans après la dernière activité, puis archivage légal 5 ans.
            </p>
          </div>
        </div>

        {/* Zone de danger */}
        <div className={styles.dangerCard}>
          <div className={styles.dangerTitle}>Zone de danger</div>
          <div className={styles.cardSubtitle}>Ces actions sont irréversibles. Réfléchissez bien avant de continuer.</div>

          <div className={styles.dangerList}>
            <div className={styles.dangerRow}>
              <div>
                <div className={styles.dangerAction}>Désactiver mon compte</div>
                <div className={styles.dangerDesc}>Votre profil devient invisible. Vous pouvez le réactiver à tout moment.</div>
              </div>
              <button className={styles.dangerOutlineBtn}>Désactiver</button>
            </div>

            <div className={styles.dangerRow}>
              <div>
                <div className={styles.dangerAction}>Supprimer définitivement mon compte</div>
                <div className={styles.dangerDesc}>
                  Toutes vos données seront effacées conformément à l'Art. 17 RGPD (droit à l'effacement).<br />
                  Cette action est irréversible. Vos messages, progression et contenus seront supprimés.
                </div>
              </div>
              <button className={styles.dangerOutlineBtn}>Supprimer mon compte</button>
            </div>

            <div className={styles.dangerRow}>
              <div className={styles.dangerAction}>Se déconnecter</div>
              <button className={styles.dangerOutlineBtn} onClick={handleLogout}>Se déconnecter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
