import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { useAuthContext } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { logPurchase } from '../../lib/purchaseLog';
import type { ApiPack } from '../../lib/mappers';
import styles from './Payment.module.css';

const CARD_ICONS = ['VISA', 'MC', 'AMEX', 'DISC'];

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  return digits;
}

export function Payment() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [email, setEmail] = useState(user?.email ?? '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [country, setCountry] = useState('FR');
  const [zip, setZip] = useState('');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [pack, setPack] = useState<{ title: string; price: number } | null>(null);

  useEffect(() => {
    if (!courseId) return;
    api
      .get<ApiPack>(`/packs/${courseId}`, false)
      .then((p) => setPack({ title: p.title, price: p.price ?? 0 }))
      .catch(() => setPack(null));
  }, [courseId]);

  async function handlePay(e: { preventDefault(): void }) {
    e.preventDefault();
    if (processing) return;
    setError('');
    setProcessing(true);

    await new Promise((r) => setTimeout(r, 1600));

    const failed = Math.random() < 0.05;
    if (failed) {
      setError('Votre carte a été refusée. Veuillez vérifier vos informations ou essayer une autre carte.');
      setProcessing(false);
      return;
    }

    try {
      await api.post(`/purchases/packs/${courseId}`);
      if (courseId && user && pack) {
        logPurchase({
          studentName: `${user.firstName} ${user.lastName}`,
          studentEmail: user.email,
          packId: courseId,
          packTitle: pack.title,
          price: pack.price,
        });
      }
      navigate(`/mon-espace/cours/${courseId}`, { replace: true });
    } catch {
      setError('Une erreur est survenue lors du paiement. Veuillez réessayer.');
      setProcessing(false);
    }
  }

  return (
    <div className={styles.page}>
      <Navbar user={user} />

      <main className={styles.main}>
        <form className={styles.form} onSubmit={handlePay}>
          {pack && (
            <div className={styles.summary}>
              <span>{pack.title}</span>
              <span>{pack.price} €</span>
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Card information</label>
            <div className={styles.cardBlock}>
              <div className={styles.cardNumberRow}>
                <input
                  className={[styles.cardInput, styles.cardNumberInput].join(' ')}
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  required
                />
                <div className={styles.cardIcons}>
                  {CARD_ICONS.map((c) => (
                    <span key={c} className={styles.cardIcon}>{c}</span>
                  ))}
                </div>
              </div>
              <div className={styles.cardBottomRow}>
                <input
                  className={[styles.cardInput, styles.expiryInput].join(' ')}
                  type="text"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  required
                />
                <div className={styles.cvcWrap}>
                  <input
                    className={[styles.cardInput, styles.cvcInput].join(' ')}
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cardholder name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Full name on card"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
              autoComplete="cc-name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Country or region</label>
            <div className={styles.countryBlock}>
              <select
                className={styles.select}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="CA">Canada</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
              </select>
              <input
                className={styles.zipInput}
                type="text"
                placeholder="Code postal"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button className={styles.payBtn} type="submit" disabled={processing}>
            {processing ? 'Traitement en cours…' : 'Payer'}
          </button>

          <p className={styles.legal}>
            En cliquant sur Payer, vous acceptez nos{' '}
            <span className={styles.legalLink}>conditions d'utilisation</span>{' '}
            et notre{' '}
            <span className={styles.legalLink}>politique de confidentialité</span>.
          </p>
        </form>
      </main>
    </div>
  );
}
