'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DisplayBrand {
  id: string
  name: string
  slug: string
  logo: string
  isFeatured: boolean
}

interface BrandsFilterProps {
  brands: DisplayBrand[]
  locale: string
}

export default function BrandsFilter({ brands, locale }: BrandsFilterProps) {
  const [activeLetter, setActiveLetter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const filteredBrands = brands
    .filter(brand => {
      const matchesLetter = activeLetter === 'all' || brand.name.toUpperCase().startsWith(activeLetter)
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLetter && matchesSearch
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const featuredBrands = brands.filter(brand => brand.isFeatured)

  const getLetterCount = (letter: string) => {
    return brands.filter(brand => brand.name.toUpperCase().startsWith(letter)).length
  }

  return (
    <div className="brands-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Nos marques</h1>
          <p>D&eacute;couvrez toutes les marques disponibles chez Ste-Marie Sports</p>
          <nav className="header-breadcrumb" aria-label="Fil d'Ariane">
            <Link href={`/${locale}`}>Accueil</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6"/>
            </svg>
            <span>Marques</span>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Featured Brands */}
          {activeLetter === 'all' && !searchQuery && featuredBrands.length > 0 && (
            <section className="featured-brands">
              <h2>Marques populaires</h2>
              <div className="featured-brands-grid">
                {featuredBrands.slice(0, 8).map((brand) => (
                  <Link key={brand.id} href={`/${locale}/marque/${brand.slug}`} className="featured-brand-card">
                    <img src={brand.logo} alt={brand.name} />
                    <span className="brand-name">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Search and Alphabet Filter */}
          <div className="brands-toolbar">
            <div className="brands-search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21L16.65 16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="alphabet-filter">
              <button
                className={`letter-btn ${activeLetter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveLetter('all')}
              >
                Toutes
              </button>
              {alphabet.map((letter) => {
                const count = getLetterCount(letter)
                return (
                  <button
                    key={letter}
                    className={`letter-btn ${activeLetter === letter ? 'active' : ''} ${count === 0 ? 'disabled' : ''}`}
                    onClick={() => count > 0 && setActiveLetter(letter)}
                    disabled={count === 0}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="brands-count">
            <span>{filteredBrands.length} marque{filteredBrands.length > 1 ? 's' : ''}</span>
            {(activeLetter !== 'all' || searchQuery) && (
              <button className="clear-filter" onClick={() => { setActiveLetter('all'); setSearchQuery('') }}>
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Brands Grid */}
          {filteredBrands.length > 0 ? (
            <div className="brands-grid">
              {filteredBrands.map((brand) => (
                <Link key={brand.id} href={`/${locale}/marque/${brand.slug}`} className="brand-card">
                  <div className="brand-card__logo">
                    <img src={brand.logo} alt={brand.name} />
                  </div>
                  <div className="brand-card__info">
                    <h3>{brand.name}</h3>
                  </div>
                  <div className="brand-card__arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/>
                      <path d="M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-brands">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21L16.65 16.65"/>
                <path d="M8 8L14 14"/>
                <path d="M14 8L8 14"/>
              </svg>
              <h3>Aucune marque trouv&eacute;e</h3>
              <p>Essayez une autre lettre ou modifiez votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
