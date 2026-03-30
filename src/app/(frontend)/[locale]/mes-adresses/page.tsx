'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import AccountSidebar from '@/components/AccountSidebar'

interface Address {
  id: string
  firstName: string
  lastName: string
  company?: string
  street: string
  street2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

interface AddressFormData {
  firstName: string
  lastName: string
  company: string
  street: string
  street2: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

const provinces = [
  { code: 'AB', nameFr: 'Alberta', nameEn: 'Alberta' },
  { code: 'BC', nameFr: 'Colombie-Britannique', nameEn: 'British Columbia' },
  { code: 'MB', nameFr: 'Manitoba', nameEn: 'Manitoba' },
  { code: 'NB', nameFr: 'Nouveau-Brunswick', nameEn: 'New Brunswick' },
  { code: 'NL', nameFr: 'Terre-Neuve-et-Labrador', nameEn: 'Newfoundland and Labrador' },
  { code: 'NS', nameFr: 'Nouvelle-\u00c9cosse', nameEn: 'Nova Scotia' },
  { code: 'NT', nameFr: 'Territoires du Nord-Ouest', nameEn: 'Northwest Territories' },
  { code: 'NU', nameFr: 'Nunavut', nameEn: 'Nunavut' },
  { code: 'ON', nameFr: 'Ontario', nameEn: 'Ontario' },
  { code: 'PE', nameFr: '\u00cele-du-Prince-\u00c9douard', nameEn: 'Prince Edward Island' },
  { code: 'QC', nameFr: 'Qu\u00e9bec', nameEn: 'Quebec' },
  { code: 'SK', nameFr: 'Saskatchewan', nameEn: 'Saskatchewan' },
  { code: 'YT', nameFr: 'Yukon', nameEn: 'Yukon' },
]

export default function MyAddressesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    street2: '',
    city: '',
    province: 'QC',
    postalCode: '',
    country: 'CA',
    phone: '',
    isDefault: false,
  })

  const getProvinceName = (code: string) => {
    const province = provinces.find(p => p.code === code)
    if (!province) return code
    return locale === 'en' ? province.nameEn : province.nameFr
  }

  const openAddModal = () => {
    setEditingAddress(null)
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      street2: '',
      city: '',
      province: 'QC',
      postalCode: '',
      country: 'CA',
      phone: '',
      isDefault: addresses.length === 0,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      street: address.street,
      street2: address.street2 || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingAddress) {
        setAddresses(addresses.map(addr =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr
        ))
        setSuccess('Adresse mise \u00e0 jour avec succ\u00e8s')
      } else {
        const newAddress: Address = {
          id: Date.now().toString(),
          ...formData,
        }
        setAddresses([...addresses, newAddress])
        setSuccess('Adresse ajout\u00e9e avec succ\u00e8s')
      }
      setIsModalOpen(false)
    } catch {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const deleteAddress = (id: string) => {
    if (!window.confirm('\u00cates-vous s\u00fbr de vouloir supprimer cette adresse?')) return
    setAddresses(addresses.filter(addr => addr.id !== id))
    setSuccess('Adresse supprim\u00e9e avec succ\u00e8s')
  }

  const setAsDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })))
  }

  if (authLoading) {
    return (
      <div className="my-addresses-page">
        <div className="page-content">
          <div className="container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push(`/${locale}/mon-compte`)
    return null
  }

  return (
    <div className="my-addresses-page">
      <div className="page-content">
        <div className="container">
          <div className="account-layout">
            <AccountSidebar locale={locale} stats={{ addresses: addresses.length }} />

            <main className="account-main">
              {success && (
                <div className="alert alert--success">
                  {success}
                  <button onClick={() => setSuccess(null)}>&times;</button>
                </div>
              )}
              {error && (
                <div className="alert alert--error">
                  {error}
                  <button onClick={() => setError(null)}>&times;</button>
                </div>
              )}

              <div className="addresses-layout">
                <section className="address-section">
                  <div className="section-header">
                    <div className="section-title">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <h2>Mes adresses</h2>
                    </div>
                    <button className="add-btn" onClick={openAddModal}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Ajouter
                    </button>
                  </div>

                  <div className="addresses-grid">
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                          {address.isDefault && (
                            <span className="default-badge">Par d\u00e9faut</span>
                          )}
                          <div className="address-card__content">
                            <strong>{address.firstName} {address.lastName}</strong>
                            {address.company && <span>{address.company}</span>}
                            <span>{address.street}</span>
                            {address.street2 && <span>{address.street2}</span>}
                            <span>{address.city}, {getProvinceName(address.province)} {address.postalCode}</span>
                            <span>{address.country === 'CA' ? 'Canada' : address.country}</span>
                            {address.phone && <span className="phone">{address.phone}</span>}
                          </div>
                          <div className="address-card__actions">
                            <button className="edit-btn" onClick={() => openEditModal(address)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Modifier
                            </button>
                            {!address.isDefault && (
                              <button className="default-btn" onClick={() => setAsDefault(address.id)}>
                                D\u00e9finir par d\u00e9faut
                              </button>
                            )}
                            <button className="delete-btn" onClick={() => deleteAddress(address.id)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-addresses">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <p>Aucune adresse enregistr\u00e9e</p>
                        <button className="add-first-btn" onClick={openAddModal}>
                          Ajouter une adresse
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</h2>
              <button className="modal__close" onClick={() => !saving && setIsModalOpen(false)} disabled={saving}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6L18 18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Pr\u00e9nom *</label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Nom *</label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="company">Entreprise (optionnel)</label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="street">Adresse *</label>
                  <input
                    type="text"
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="street2">Appartement, suite, etc. (optionnel)</label>
                  <input
                    type="text"
                    id="street2"
                    value={formData.street2}
                    onChange={(e) => setFormData({...formData, street2: e.target.value})}
                    disabled={saving}
                  />
                </div>

                <div className="form-row form-row--3">
                  <div className="form-group">
                    <label htmlFor="city">Ville *</label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="province">Province *</label>
                    <select
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      required
                      disabled={saving}
                    >
                      {provinces.map((prov) => (
                        <option key={prov.code} value={prov.code}>
                          {locale === 'en' ? prov.nameEn : prov.nameFr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Code postal *</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value.toUpperCase()})}
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">T\u00e9l\u00e9phone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={saving}
                  />
                </div>

                <div className="form-group form-group--checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      disabled={saving}
                    />
                    <span>D\u00e9finir comme adresse par d\u00e9faut</span>
                  </label>
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--outline" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : (editingAddress ? 'Enregistrer' : 'Ajouter l\'adresse')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
