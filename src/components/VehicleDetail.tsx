'use client'

import { useState } from 'react'
import Link from 'next/link'

interface VehicleData {
  title: string
  slug: string
  condition: string
  vehicleType: string
  year: number
  brand: { name: string } | null
  model: string
  trim: string
  mileage: number
  mileageUnit: string
  price: number
  msrp: number
  description: string
  shortDescription: string
  stockNumber: string
  vin: string
  exteriorColor: string
  transmission: string
  fuelType: string
  driveType: string
  engineSize: string
  engineType: string
  horsepower: string
  isAvailable: boolean
  isFeatured: boolean
}

interface VehicleDetailProps {
  vehicle: VehicleData
  images: string[]
  locale: string
}

export default function VehicleDetail({ vehicle, images, locale }: VehicleDetailProps) {
  const [activeImage, setActiveImage] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>('description')

  const getConditionLabel = (condition: string): string => {
    const labels: Record<string, string> = {
      new: 'Neuf',
      used: 'Usag\u00e9',
      demo: 'D\u00e9mo',
    }
    return labels[condition] || condition
  }

  const getVehicleTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      motorcycle: 'Moto',
      atv: 'VTT',
      utv: 'C\u00f4te-\u00e0-c\u00f4te',
      snowmobile: 'Motoneige',
      watercraft: 'Motomarine',
      other: 'Autre',
    }
    return labels[type] || type
  }

  const savings = vehicle.msrp && vehicle.price ? vehicle.msrp - vehicle.price : 0
  const savingsPercent = savings > 0 && vehicle.msrp ? Math.round((savings / vehicle.msrp) * 100) : 0

  return (
    <div className="vehicle-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link href={`/${locale}`}>Accueil</Link>
          <span>/</span>
          <Link href={`/${locale}/vehicules`}>V\u00e9hicules</Link>
          <span>/</span>
          <Link href={`/${locale}/vehicules-${vehicle.condition === 'new' ? 'neufs' : 'usages'}`}>
            {getConditionLabel(vehicle.condition)}
          </Link>
          <span>/</span>
          <span>{vehicle.title}</span>
        </div>
      </div>

      {/* Main Section */}
      <section className="vehicle-main">
        <div className="container">
          <div className="vehicle-layout">
            {/* Gallery */}
            <div className="vehicle-gallery">
              <div className="vehicle-gallery__main">
                <img src={images[activeImage]} alt={vehicle.title} />
                {vehicle.condition !== 'new' && (
                  <span className="vehicle-badge vehicle-badge--condition">{getConditionLabel(vehicle.condition)}</span>
                )}
                {savings > 0 && (
                  <span className="vehicle-badge vehicle-badge--savings">\u00c9conomisez {savings.toLocaleString()} $</span>
                )}
                {images.length > 1 && (
                  <div className="vehicle-gallery__nav">
                    <button
                      onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                      aria-label="Image pr\u00e9c\u00e9dente"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18L9 12L15 6"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                      aria-label="Image suivante"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18L15 12L9 6"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="vehicle-gallery__thumbs">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`vehicle-gallery__thumb ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={img} alt={`${vehicle.title} vue ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="vehicle-info">
              <div className="vehicle-info__header">
                <div className="vehicle-status">
                  <span className={`status-badge status-badge--${vehicle.isAvailable ? 'disponible' : 'vendu'}`}>
                    {vehicle.isAvailable ? 'Disponible' : 'Vendu'}
                  </span>
                  <span className="vehicle-condition">{getConditionLabel(vehicle.condition)}</span>
                </div>
                <h1 className="vehicle-title">{vehicle.title}</h1>
                <div className="vehicle-subtitle">
                  <span>{vehicle.year} {vehicle.brand?.name || ''} {vehicle.model} {vehicle.trim || ''}</span>
                </div>
              </div>

              <div className="vehicle-price-block">
                <div className="vehicle-price">
                  {vehicle.price ? (
                    <>
                      <span className="vehicle-price__current">{vehicle.price.toLocaleString()} $</span>
                      {savings > 0 && vehicle.msrp && (
                        <>
                          <span className="vehicle-price__msrp">PDSF: {vehicle.msrp.toLocaleString()} $</span>
                          <span className="vehicle-price__savings">-{savingsPercent}%</span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="vehicle-price__current">Contactez-nous</span>
                  )}
                </div>
                <p className="vehicle-price__note">+ taxes et frais de pr\u00e9paration</p>
              </div>

              {/* Quick Specs */}
              <div className="vehicle-quick-specs">
                <div className="quick-spec">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6V12L16 14"/>
                  </svg>
                  <div>
                    <span className="quick-spec__label">Kilom\u00e9trage</span>
                    <span className="quick-spec__value">{(vehicle.mileage || 0).toLocaleString()} {vehicle.mileageUnit || 'km'}</span>
                  </div>
                </div>
                <div className="quick-spec">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                  <div>
                    <span className="quick-spec__label">Type</span>
                    <span className="quick-spec__value">{getVehicleTypeLabel(vehicle.vehicleType)}</span>
                  </div>
                </div>
                {vehicle.engineSize && (
                  <div className="quick-spec">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
                    </svg>
                    <div>
                      <span className="quick-spec__label">Moteur</span>
                      <span className="quick-spec__value">{vehicle.engineSize}</span>
                    </div>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="quick-spec">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <div>
                      <span className="quick-spec__label">Transmission</span>
                      <span className="quick-spec__value">{vehicle.transmission}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Details */}
              <div className="vehicle-details">
                <h3>Informations du v\u00e9hicule</h3>
                <div className="vehicle-details__grid">
                  {vehicle.vin && (
                    <div className="detail-item">
                      <span className="detail-item__label">NIV (VIN)</span>
                      <span className="detail-item__value">{vehicle.vin}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-item__label">No. Stock</span>
                    <span className="detail-item__value">{vehicle.stockNumber}</span>
                  </div>
                  {vehicle.exteriorColor && (
                    <div className="detail-item">
                      <span className="detail-item__label">Couleur</span>
                      <span className="detail-item__value">{vehicle.exteriorColor}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-item__label">Cat\u00e9gorie</span>
                    <span className="detail-item__value">{getVehicleTypeLabel(vehicle.vehicleType)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="vehicle-actions">
                <Link
                  href={`/${locale}/contact?subject=essai-routier&vehicle=${encodeURIComponent(vehicle.title)}`}
                  className="btn btn--primary btn--lg btn--full"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8V12L14 14"/>
                  </svg>
                  Demander un essai routier
                </Link>
                <div className="vehicle-actions__secondary">
                  <Link href={`/${locale}/contact`} className="btn btn--outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Appeler
                  </Link>
                  <Link href={`/${locale}/contact`} className="btn btn--outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                      <path d="M22 6L12 13L2 6"/>
                    </svg>
                    Courriel
                  </Link>
                  <button className="btn btn--outline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"/>
                    </svg>
                    Favoris
                  </button>
                </div>
              </div>

              {/* Dealer Info */}
              <div className="dealer-info">
                <div className="dealer-info__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <strong>Ste-Marie Sports</strong>
                  <span>Contactez-nous pour plus d&apos;informations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="vehicle-tabs-section">
        <div className="container">
          <div className="vehicle-tabs">
            <div className="vehicle-tabs__nav">
              <button
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={activeTab === 'specs' ? 'active' : ''}
                onClick={() => setActiveTab('specs')}
              >
                Sp\u00e9cifications
              </button>
            </div>
            <div className="vehicle-tabs__content">
              {activeTab === 'description' && (
                <div className="tab-content">
                  <p>{vehicle.description || vehicle.shortDescription || 'Aucune description disponible.'}</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="tab-content specs-content">
                  <div className="specs-grid">
                    <div className="specs-section">
                      <h4>G\u00e9n\u00e9ral</h4>
                      <dl className="specs-list">
                        <div className="spec-row">
                          <dt>Ann\u00e9e</dt>
                          <dd>{vehicle.year}</dd>
                        </div>
                        {vehicle.brand && (
                          <div className="spec-row">
                            <dt>Marque</dt>
                            <dd>{vehicle.brand.name}</dd>
                          </div>
                        )}
                        <div className="spec-row">
                          <dt>Mod\u00e8le</dt>
                          <dd>{vehicle.model}</dd>
                        </div>
                        {vehicle.trim && (
                          <div className="spec-row">
                            <dt>Version</dt>
                            <dd>{vehicle.trim}</dd>
                          </div>
                        )}
                        <div className="spec-row">
                          <dt>Type</dt>
                          <dd>{getVehicleTypeLabel(vehicle.vehicleType)}</dd>
                        </div>
                        <div className="spec-row">
                          <dt>Condition</dt>
                          <dd>{getConditionLabel(vehicle.condition)}</dd>
                        </div>
                      </dl>
                    </div>
                    {(vehicle.engineType || vehicle.engineSize || vehicle.horsepower || vehicle.fuelType) && (
                      <div className="specs-section">
                        <h4>Moteur</h4>
                        <dl className="specs-list">
                          {vehicle.engineType && (
                            <div className="spec-row">
                              <dt>Type de moteur</dt>
                              <dd>{vehicle.engineType}</dd>
                            </div>
                          )}
                          {vehicle.engineSize && (
                            <div className="spec-row">
                              <dt>Cylindr\u00e9e</dt>
                              <dd>{vehicle.engineSize}</dd>
                            </div>
                          )}
                          {vehicle.horsepower && (
                            <div className="spec-row">
                              <dt>Puissance</dt>
                              <dd>{vehicle.horsepower} ch</dd>
                            </div>
                          )}
                          {vehicle.fuelType && (
                            <div className="spec-row">
                              <dt>Carburant</dt>
                              <dd>{vehicle.fuelType}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                    {(vehicle.transmission || vehicle.driveType) && (
                      <div className="specs-section">
                        <h4>Transmission</h4>
                        <dl className="specs-list">
                          {vehicle.transmission && (
                            <div className="spec-row">
                              <dt>Transmission</dt>
                              <dd>{vehicle.transmission}</dd>
                            </div>
                          )}
                          {vehicle.driveType && (
                            <div className="spec-row">
                              <dt>Entra\u00eenement</dt>
                              <dd>{vehicle.driveType}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                    <div className="specs-section">
                      <h4>Kilom\u00e9trage</h4>
                      <dl className="specs-list">
                        <div className="spec-row">
                          <dt>Odom\u00e8tre</dt>
                          <dd>{(vehicle.mileage || 0).toLocaleString()} {vehicle.mileageUnit || 'km'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
