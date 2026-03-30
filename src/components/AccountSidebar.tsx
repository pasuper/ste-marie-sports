'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'

interface AccountSidebarProps {
  locale: string;
  stats?: {
    orders?: number;
    wishlist?: number;
    addresses?: number;
  };
}

const formatMemberSince = (dateString: string, locale: string = 'fr'): string => {
  const date = new Date(dateString);
  const months: Record<string, string[]> = {
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  const month = months[locale]?.[date.getMonth()] || months.fr[date.getMonth()];
  return `${month} ${date.getFullYear()}`;
};

const AccountSidebar: React.FC<AccountSidebarProps> = ({ locale, stats = {} }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const firstName = user?.firstName || 'Utilisateur';
  const lastName = user?.lastName || '';
  const memberSince = user?.id ? formatMemberSince(new Date().toISOString(), locale) : '';
  const isAdmin = user?.role === 'admin';

  const defaultStats = {
    orders: stats.orders ?? 12,
    wishlist: stats.wishlist ?? 5,
    addresses: stats.addresses ?? 2,
  };

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  return (
    <aside className="account-sidebar">
      <div className="user-card">
        <div className="user-avatar">
          <span>{getInitials()}</span>
        </div>
        <div className="user-info">
          <h2>{firstName} {lastName}</h2>
          {memberSince && <p>Membre depuis {memberSince}</p>}
        </div>
      </div>

      <nav className="account-nav">
        <Link href={`/${locale}/mon-compte`} className={`account-nav__item ${isActive('/mon-compte') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Tableau de bord
        </Link>

        <Link href={`/${locale}/mes-commandes`} className={`account-nav__item ${isActive('/mes-commandes') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Mes commandes
          <span className="badge">{defaultStats.orders}</span>
        </Link>

        <Link href={`/${locale}/ma-liste-envies`} className={`account-nav__item ${isActive('/ma-liste-envies') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Liste d&apos;envies
          <span className="badge">{defaultStats.wishlist}</span>
        </Link>

        <Link href={`/${locale}/mes-adresses`} className={`account-nav__item ${isActive('/mes-adresses') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Mes adresses
          <span className="badge">{defaultStats.addresses}</span>
        </Link>

        <Link href={`/${locale}/suivi-commande`} className={`account-nav__item ${isActive('/suivi-commande') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          Suivi de commande
        </Link>

        {isAdmin && (
          <>
            <div className="account-nav__divider"></div>

            <Link href={`/${locale}/import-produits`} className={`account-nav__item ${isActive('/import-produits') ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Import de produits
            </Link>
          </>
        )}

        <div className="account-nav__divider"></div>

        <button className="account-nav__item account-nav__item--logout" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
