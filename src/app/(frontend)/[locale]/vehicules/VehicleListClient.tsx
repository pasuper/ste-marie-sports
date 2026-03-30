'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Vehicle {
  id: string
  documentId: string
  title: string
  slug: string
  condition: string
  vehicleType: string
  year: number
  brand: any
  model: string
  mileage: number
  mileageUnit: string
  price: number
  msrp: number
  thumbnail: { url: string } | null
  images: { url: string }[]
  stock: number
  stockNumber: string
  vin: string
  isFeatured: boolean
  isAvailable: boolean
  transmission: string
  fuelType: string
  driveType: string
  exteriorColor: string
}

interface VehicleListClientProps {
  locale: string
  vehicles: Vehicle[]
  brands: { id: string; documentId: string; name: string; slug: string }[]
  totalCount: number
  totalPages: number
  currentPage: number
  initialCondition?: string
  initialVehicleType?: string
  initialSortBy?: string
  initialBrandSlug?: string
  initialMinPrice?: number
  initialMaxPrice?: number
  initialMinYear?: number
  initialMaxYear?: number
  initialSearch?: string
}

export default function VehicleListClient({
  locale,
  vehicles,
  brands,
  totalCount,
  totalPages,
  currentPage,
  initialCondition,
  initialVehicleType,
  initialSortBy = 'featured',
  initialBrandSlug,
  initialMinPrice,
  initialMaxPrice,
  initialMinYear,
  initialMaxYear,
  initialSearch,
}: VehicleListClientProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [selectedBrand, setSelectedBrand] = useState(initialBrandSlug || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice || 0, initialMaxPrice || 100000])
  const [yearRange, setYearRange] = useState<[number, number]>([initialMinYear || 2015, initialMaxYear || 2026])

  const vehicleTypes = [
    { value: 'motorcycle', label: locale === 'fr' ? 'Motos' : 'Motorcycles' },
    { value: 'atv', label: 'VTT / ATV' },
    { value: 'utv', label: locale === 'fr' ? 'Côte-à-côte' : 'Side by Side' },
    { value: 'snowmobile', label: locale === 'fr' ? 'Motoneiges' : 'Snowmobiles' },
    { value: 'pwc', label: locale === 'fr' ? 'Motomarines' : 'Watercraft' },
  ]

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = locale === 'fr'
      ? { new: 'Neuf', used: 'Usagé', demo: 'Démo' }
      : { new: 'New', used: 'Used', demo: 'Demo' }
    return labels[condition] || condition
  }

  const getPageTitle = () => {
    if (initialCondition === 'used') return locale === 'fr' ? 'Véhicules usagés' : 'Used Vehicles'
    if (initialCondition === 'new') return locale === 'fr' ? 'Véhicules neufs' : 'New Vehicles'
    if (initialCondition === 'demo') return locale === 'fr' ? 'Véhicules démo' : 'Demo Vehicles'
    return locale === 'fr' ? 'Nos véhicules' : 'Our Vehicles'
  }

  const getPageDescription = () => {
    if (initialCondition === 'used') return locale === 'fr' ? 'Découvrez notre sélection de véhicules usagés de qualité' : 'Discover our selection of quality used vehicles'
    if (initialCondition === 'new') return locale === 'fr' ? 'Explorez notre inventaire de véhicules neufs' : 'Explore our new vehicle inventory'
    return locale === 'fr' ? 'Découvrez notre inventaire de motos, VTT, côte-à-côte et plus encore' : 'Discover our inventory of motorcycles, ATVs, side-by-sides and more'
  }

  const updateUrl = (overrides: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams()
    const values: Record<string, string | undefined> = {
      condition: initialCondition,
      type: initialVehicleType,
      sort: sortBy !== 'featured' ? sortBy : undefined,
      brand: selectedBrand || undefined,
      page: undefined,
      ...overrides,
    }
    Object.entries(values).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.push(`/${locale}/vehicules?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    updateUrl({ sort: newSort !== 'featured' ? newSort : undefined })
  }

  const handleBrandToggle = (brandSlug: string) => {
    const newBrand = selectedBrand === brandSlug ? '' : brandSlug
    setSelectedBrand(newBrand)
    updateUrl({ brand: newBrand || undefined })
  }

  const clearFilters = () => {
    setSelectedBrand('')
    setPriceRange([0, 100000])
    setYearRange([2015, 2026])
    router.push(`/${locale}/vehicules${initialCondition ? `?condition=${initialCondition}` : ''}`)
  }

  const activeFiltersCount = (selectedBrand ? 1 : 0) + (initialMinPrice ? 1 : 0) + (initialMaxPrice ? 1 : 0)

  return (
    <div className="vehicle-list-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>{getPageTitle()}</h1>
          <p>{getPageDescription()}</p>
          <nav className="header-breadcrumb" aria-label="Fil d'Ariane">
            <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6"/></svg>
            <span>{getPageTitle()}</span>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="page-layout">
            {/* Mobile Filter Toggle */}
            <button className="mobile-filter-toggle" onClick={() => setMobileFiltersOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
              </svg>
              {locale === 'fr' ? 'Filtres' : 'Filters'}
              {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
            </button>

            {/* Sidebar Filters */}
            <aside className={`filters-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
              <div className="filters-sidebar__header">
                <h2>{locale === 'fr' ? 'Filtres' : 'Filters'}</h2>
                <div className="filters-sidebar__actions">
                  {activeFiltersCount > 0 && (
                    <button className="clear-filters" onClick={clearFilters}>
                      {locale === 'fr' ? 'Effacer tout' : 'Clear all'}
                    </button>
                  )}
                  <button className="close-filters" onClick={() => setMobileFiltersOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6L18 18"/></svg>
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Prix' : 'Price'}</h3>
                <div className="price-range">
                  <div className="range-inputs">
                    <div className="range-input">
                      <label>Min</label>
                      <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} placeholder="0" />
                    </div>
                    <span className="range-separator">-</span>
                    <div className="range-input">
                      <label>Max</label>
                      <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])} placeholder="100000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Année' : 'Year'}</h3>
                <div className="year-range">
                  <div className="range-inputs">
                    <div className="range-input">
                      <label>{locale === 'fr' ? 'De' : 'From'}</label>
                      <select value={yearRange[0]} onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}>
                        {Array.from({ length: 21 }, (_, i) => 2006 + i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <span className="range-separator">-</span>
                    <div className="range-input">
                      <label>{locale === 'fr' ? 'À' : 'To'}</label>
                      <select value={yearRange[1]} onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}>
                        {Array.from({ length: 21 }, (_, i) => 2006 + i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Types */}
              {!initialVehicleType && (
                <div className="filter-section">
                  <h3>{locale === 'fr' ? 'Type de véhicule' : 'Vehicle Type'}</h3>
                  <ul className="filter-list filter-list--checkbox">
                    {vehicleTypes.map((type) => (
                      <li key={type.value}>
                        <label>
                          <input type="checkbox" checked={initialVehicleType === type.value} onChange={() => updateUrl({ type: type.value })} />
                          <span>{type.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Brands */}
              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Marque' : 'Brand'}</h3>
                <ul className="filter-list filter-list--checkbox filter-list--scrollable">
                  {brands.map((brand) => (
                    <li key={brand.id}>
                      <label>
                        <input type="checkbox" checked={selectedBrand === brand.slug} onChange={() => handleBrandToggle(brand.slug)} />
                        <span>{brand.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filters-sidebar__footer">
                <button className="btn btn--primary btn--full" onClick={() => setMobileFiltersOpen(false)}>
                  {locale === 'fr' ? `Voir ${totalCount} véhicules` : `View ${totalCount} vehicles`}
                </button>
              </div>
            </aside>

            {mobileFiltersOpen && <div className="filters-overlay" onClick={() => setMobileFiltersOpen(false)} />}

            {/* Main Content */}
            <main className="vehicles-main">
              {/* Toolbar */}
              <div className="toolbar">
                <div className="toolbar__results">
                  <span>{totalCount} {locale === 'fr' ? 'véhicules' : 'vehicles'}</span>
                </div>
                <div className="toolbar__actions">
                  <div className="sort-select">
                    <label>{locale === 'fr' ? 'Trier par:' : 'Sort by:'}</label>
                    <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                      <option value="featured">{locale === 'fr' ? 'En vedette' : 'Featured'}</option>
                      <option value="price-low">{locale === 'fr' ? 'Prix: Bas à Élevé' : 'Price: Low to High'}</option>
                      <option value="price-high">{locale === 'fr' ? 'Prix: Élevé à Bas' : 'Price: High to Low'}</option>
                      <option value="year-new">{locale === 'fr' ? 'Année: Récent' : 'Year: Newest'}</option>
                      <option value="year-old">{locale === 'fr' ? 'Année: Ancien' : 'Year: Oldest'}</option>
                      <option value="mileage-low">{locale === 'fr' ? 'Kilométrage: Bas' : 'Mileage: Lowest'}</option>
                    </select>
                  </div>
                  <div className="view-toggle">
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    </button>
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List view">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4"/><rect x="3" y="10" width="18" height="4"/><rect x="3" y="16" width="18" height="4"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="active-filters">
                  {selectedBrand && (
                    <button className="active-filter" onClick={() => handleBrandToggle(selectedBrand)}>
                      {brands.find(b => b.slug === selectedBrand)?.name || selectedBrand}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6L18 18"/></svg>
                    </button>
                  )}
                  <button className="clear-all-filters" onClick={clearFilters}>{locale === 'fr' ? 'Effacer tout' : 'Clear all'}</button>
                </div>
              )}

              {/* Vehicles Grid */}
              {vehicles.length > 0 ? (
                <div className={`vehicles-grid vehicles-grid--${viewMode}`}>
                  {vehicles.map((vehicle) => (
                    <Link key={vehicle.id} href={`/${locale}/vehicule/${vehicle.slug}`} className="vehicle-card">
                      <div className="vehicle-card__image">
                        <img src={vehicle.thumbnail?.url || '/placeholder-product.png'} alt={vehicle.title} loading="lazy" />
                        <span className={`vehicle-card__condition vehicle-card__condition--${vehicle.condition}`}>
                          {getConditionLabel(vehicle.condition)}
                        </span>
                        {vehicle.isFeatured && <span className="vehicle-card__featured">{locale === 'fr' ? 'En vedette' : 'Featured'}</span>}
                        <button className="vehicle-card__favorite" onClick={(e) => e.preventDefault()} aria-label="Favoris">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="vehicle-card__content">
                        <div className="vehicle-card__top">
                          <div className="vehicle-card__title-section">
                            <div className="vehicle-card__header">
                              <span className="vehicle-card__year">{vehicle.year}</span>
                              <span className="vehicle-card__make">{vehicle.brand?.name || ''}</span>
                              {vehicle.stockNumber && <span className="vehicle-card__stock">#{vehicle.stockNumber}</span>}
                            </div>
                            <h3 className="vehicle-card__title">{vehicle.title}</h3>
                          </div>
                          <div className="vehicle-card__price-section">
                            {vehicle.price ? (
                              <>
                                <span className="vehicle-card__price-current">{vehicle.price.toLocaleString()} $</span>
                                {vehicle.msrp && vehicle.msrp > vehicle.price && (
                                  <span className="vehicle-card__price-msrp">PDSF: {vehicle.msrp.toLocaleString()} $</span>
                                )}
                              </>
                            ) : (
                              <span className="vehicle-card__price-current">{locale === 'fr' ? 'Contactez-nous' : 'Contact us'}</span>
                            )}
                          </div>
                        </div>

                        {viewMode === 'list' ? (
                          <div className="vehicle-card__specs-grid">
                            <div className="spec-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 14"/></svg>
                              <div className="spec-content">
                                <span className="spec-label">{locale === 'fr' ? 'Kilométrage' : 'Mileage'}</span>
                                <span className="spec-value">{vehicle.mileage?.toLocaleString() || 0} {vehicle.mileageUnit || 'km'}</span>
                              </div>
                            </div>
                            <div className="spec-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
                              <div className="spec-content">
                                <span className="spec-label">{locale === 'fr' ? 'Année' : 'Year'}</span>
                                <span className="spec-value">{vehicle.year}</span>
                              </div>
                            </div>
                            {vehicle.transmission && (
                              <div className="spec-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v2a2 2 0 002 2h8a2 2 0 002-2V8M6 16v-2M18 16v-2"/></svg>
                                <div className="spec-content">
                                  <span className="spec-label">Transmission</span>
                                  <span className="spec-value">{vehicle.transmission === 'automatic' ? 'Automatique' : vehicle.transmission === 'manual' ? 'Manuelle' : vehicle.transmission === 'cvt' ? 'CVT' : vehicle.transmission}</span>
                                </div>
                              </div>
                            )}
                            {vehicle.fuelType && (
                              <div className="spec-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h12M5 22V9.5L3 6V3h8v3l-2 3.5V22"/><path d="M15 22V6l4-3v9"/></svg>
                                <div className="spec-content">
                                  <span className="spec-label">{locale === 'fr' ? 'Carburant' : 'Fuel'}</span>
                                  <span className="spec-value">{vehicle.fuelType === 'gasoline' ? (locale === 'fr' ? 'Essence' : 'Gasoline') : vehicle.fuelType === 'diesel' ? 'Diesel' : vehicle.fuelType === 'electric' ? (locale === 'fr' ? 'Électrique' : 'Electric') : vehicle.fuelType}</span>
                                </div>
                              </div>
                            )}
                            {vehicle.driveType && (
                              <div className="spec-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 15V9a6 6 0 0112 0v6"/></svg>
                                <div className="spec-content">
                                  <span className="spec-label">{locale === 'fr' ? 'Traction' : 'Drive'}</span>
                                  <span className="spec-value">{vehicle.driveType === '4wd' ? '4x4' : vehicle.driveType === '2wd' ? '2x4' : vehicle.driveType === 'awd' ? 'AWD' : vehicle.driveType}</span>
                                </div>
                              </div>
                            )}
                            {vehicle.exteriorColor && (
                              <div className="spec-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
                                <div className="spec-content">
                                  <span className="spec-label">{locale === 'fr' ? 'Couleur' : 'Color'}</span>
                                  <span className="spec-value">{vehicle.exteriorColor}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="vehicle-card__specs">
                            <span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 14"/></svg>
                              {vehicle.mileage?.toLocaleString() || 0} {vehicle.mileageUnit || 'km'}
                            </span>
                            <span>{vehicle.model}</span>
                          </div>
                        )}

                        {viewMode === 'list' && (
                          <div className="vehicle-card__bottom">
                            <div className="vehicle-card__meta">
                              {vehicle.vin && <span className="meta-item">VIN: {vehicle.vin.slice(-6)}</span>}
                              {vehicle.model && <span className="meta-item">{locale === 'fr' ? 'Modèle' : 'Model'}: {vehicle.model}</span>}
                            </div>
                            <span className="vehicle-card__cta">
                              {locale === 'fr' ? 'Voir les détails' : 'View details'}
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/><path d="M8 8L14 14"/><path d="M14 8L8 14"/></svg>
                  <h3>{locale === 'fr' ? 'Aucun véhicule trouvé' : 'No vehicles found'}</h3>
                  <p>{locale === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria'}</p>
                  <button className="btn btn--primary" onClick={clearFilters}>{locale === 'fr' ? 'Effacer les filtres' : 'Clear filters'}</button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="pagination__btn" disabled={currentPage === 1} onClick={() => updateUrl({ page: String(currentPage - 1) })}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18L9 12L15 6"/></svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) pageNum = i + 1
                    else if (currentPage <= 3) pageNum = i + 1
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                    else pageNum = currentPage - 2 + i
                    return (
                      <button key={pageNum} className={`pagination__btn ${currentPage === pageNum ? 'pagination__btn--active' : ''}`} onClick={() => updateUrl({ page: String(pageNum) })}>
                        {pageNum}
                      </button>
                    )
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="pagination__ellipsis">...</span>
                      <button className="pagination__btn" onClick={() => updateUrl({ page: String(totalPages) })}>{totalPages}</button>
                    </>
                  )}
                  <button className="pagination__btn" disabled={currentPage === totalPages} onClick={() => updateUrl({ page: String(currentPage + 1) })}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6"/></svg>
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
