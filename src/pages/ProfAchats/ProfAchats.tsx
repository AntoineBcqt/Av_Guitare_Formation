import { useState, useEffect } from 'react';
import { getPurchaseLog, type PurchaseLogEntry } from '../../lib/purchaseLog';
import { Avatar } from '../../components/Avatar/Avatar';
import styles from './ProfAchats.module.css';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function initialsOf(name: string) {
  return name.split(' ').map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function ProfAchats() {
  const [purchases, setPurchases] = useState<PurchaseLogEntry[]>([]);

  useEffect(() => {
    setPurchases(getPurchaseLog());
  }, []);

  const totalRevenue = purchases.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Achats</h1>
        <p className={styles.pageCount}>{purchases.length} achat{purchases.length !== 1 ? 's' : ''} enregistré{purchases.length !== 1 ? 's' : ''}</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Revenu total</div>
          <div className={styles.statValue}>{totalRevenue} €</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Achats enregistrés</div>
          <div className={styles.statValue}>{purchases.length}</div>
        </div>
      </div>

      <div className={styles.card}>
        {purchases.length === 0 ? (
          <div className={styles.emptyState}>
            Aucun achat enregistré pour l'instant. Les achats effectués depuis ce navigateur apparaîtront ici.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Élève</th>
                <th>Pack acheté</th>
                <th>Prix</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.studentCell}>
                      <Avatar initials={initialsOf(p.studentName)} size={32} />
                      <div>
                        <div className={styles.studentName}>{p.studentName}</div>
                        <div className={styles.studentEmail}>{p.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.packTitle}>{p.packTitle}</td>
                  <td>
                    {p.price > 0 ? (
                      <span className={styles.price}>{p.price} €</span>
                    ) : (
                      <span className={styles.freeLabel}>Gratuit</span>
                    )}
                  </td>
                  <td className={styles.date}>{formatDate(p.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
