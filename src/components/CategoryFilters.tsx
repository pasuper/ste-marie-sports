'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

interface CategoryFiltersProps {
  locale: string
  categorySlug: string
  currentCategory: any | null
  allCategories: any[]
  brands: any[]
  products: any[]
  totalProducts: number
  totalPages: number
  currentPage: number
  sortBy: string
  selectedBrands: string[]
  minPrice: number
  maxPrice: number
}

export default function CategoryFilters({
  locale,
  categorySlug,
  currentCategory,
  allCategories,
  brands,
  products,
  totalProducts,
  totalPages,
  currentPage,
  sortBy,
  selectedBrands,
  minPrice,
  maxPrice,
}: CategoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Update URL params
  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    if (key !== 'page') {
      newParams.set('page', '1')
    }
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    updateParams('sort', newSort)
  }

  const handlePageChange = (page: number) => {
    updateParams('page', page.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleBrand = (brandSlug: string) => {
    const newBrands = selectedBrands.includes(brandSlug)
      ? selectedBrands.filter(b => b !== brandSlug)
      : [...selectedBrands, brandSlug]
    updateParams('brands', newBrands.length > 0 ? newBrands.join(',') : null)
  }

  // Build category hierarchy for sidebar
  const parentCategories = allCategories.filter(c => !c.parent)

  // Get children for a category based on parent relationship
  const getChildCategories = (parentId: string) => {
    return allCategories.filter(c => {
      const pid = typeof c.parent === 'object' ? c.parent?.id : c.parent
      return pid === parentId
    })
  }

  const toggleCategoryExpand = (slug: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(slug)) {
        newSet.delete(slug)
      } else {
        newSet.add(slug)
      }
      return newSet
    })
  }

  // Auto-expand current category's parent
  useEffect(() => {
    if (currentCategory?.parent) {
      const parentSlug = typeof currentCategory.parent === 'object'
        ? currentCategory.parent.slug
        : null
      if (parentSlug) {
        setExpandedCategories(prev => new Set(prev).add(parentSlug))
      }
    }
    // Also expand the current category itself if it's a parent
    if (categorySlug) {
      const cat = allCategories.find(c => c.slug === categorySlug)
      if (cat) {
        const children = getChildCategories(cat.id)
        if (children.length > 0) {
          setExpandedCategories(prev => new Set(prev).add(cat.slug))
        }
      }
    }
  }, [categorySlug, allCategories])

  // Breadcrumb
  const breadcrumbs: { name: string; link: string }[] = [
    { name: locale === 'fr' ? 'Accueil' : 'Home', link: `/${locale}` },
  ]
  if (currentCategory?.parent && typeof currentCategory.parent === 'object') {
    breadcrumbs.push({
      name: currentCategory.parent.name,
      link: `/${locale}/category/${currentCategory.parent.slug}`,
    })
  }
  if (currentCategory) {
    breadcrumbs.push({
      name: currentCategory.name,
      link: `/${locale}/category/${currentCategory.slug}`,
    })
  }

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return (
      <div className="pagination">
        <button
          className="pagination__btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18L9 12L15 6"/>
          </svg>
        </button>
        {pages.map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={idx}
              className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="pagination__ellipsis">{page}</span>
          )
        ))}
        <button
          className="pagination__btn"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18L15 12L9 6"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header">
        <div className="container">
          <h1>{currentCategory?.name || (locale === 'fr' ? 'Tous les produits' : 'All Products')}</h1>
          {/* Breadcrumb under title */}
          <div className="breadcrumb breadcrumb--inline">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx}>
                {idx > 0 && <span className="breadcrumb__separator">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="breadcrumb__current">{crumb.name}</span>
                ) : (
                  <Link href={crumb.link}>{crumb.name}</Link>
                )}
              </span>
            ))}
          </div>
          <p className="category-count">
            {`${totalProducts} ${locale === 'fr' ? 'produits trouv\u00e9s' : 'products found'}`}
          </p>
          {currentCategory?.description && (
            <p className="category-description">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="category-content">
        <div className="container">
          <div className="category-layout">
            {/* Sidebar Filters */}
            <aside className="category-sidebar">
              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Cat\u00e9gories' : 'Categories'}</h3>
                <ul className="filter-list filter-list--expandable">
                  {parentCategories.map((cat) => {
                    const children = getChildCategories(cat.id)
                    const hasChildren = children.length > 0
                    const isExpanded = expandedCategories.has(cat.slug)
                    const isActive = categorySlug === cat.slug || allCategories.some(c => {
                      const pid = typeof c.parent === 'object' ? c.parent?.slug : null
                      return c.slug === categorySlug && pid === cat.slug
                    })

                    return (
                      <li key={cat.id} className={`filter-item ${isActive ? 'filter-item--active' : ''}`}>
                        <div className="filter-item__header">
                          <Link
                            href={`/${locale}/category/${cat.slug}`}
                            className={categorySlug === cat.slug ? 'active' : ''}
                          >
                            {cat.displayName || cat.name}
                          </Link>
                          {hasChildren && (
                            <button
                              className={`filter-item__toggle ${isExpanded ? 'filter-item__toggle--open' : ''}`}
                              onClick={() => toggleCategoryExpand(cat.slug)}
                              aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={isExpanded ? 'M18 15L12 9L6 15' : 'M6 9L12 15L18 9'} />
                              </svg>
                            </button>
                          )}
                        </div>
                        {hasChildren && isExpanded && (
                          <ul className="filter-sublist">
                            {children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/${locale}/category/${child.slug}`}
                                  className={categorySlug === child.slug ? 'active' : ''}
                                >
                                  {child.displayName || child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Prix' : 'Price'}</h3>
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  />
                  <div className="price-inputs">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Marques' : 'Brands'}</h3>
                <ul className="filter-list filter-list--checkbox">
                  {brands.slice(0, 15).map((brand) => (
                    <li key={brand.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.slug)}
                          onChange={() => toggleBrand(brand.slug)}
                        />
                        <span>{brand.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-section">
                <h3>{locale === 'fr' ? 'Disponibilit\u00e9' : 'Availability'}</h3>
                <ul className="filter-list filter-list--checkbox">
                  <li>
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>{locale === 'fr' ? 'En stock' : 'In Stock'}</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="checkbox" />
                      <span>{locale === 'fr' ? 'En solde' : 'On Sale'}</span>
                    </label>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="category-main">
              {/* Toolbar */}
              <div className="category-toolbar">
                <div className="toolbar-left">
                  <span>{totalProducts} {locale === 'fr' ? 'produits' : 'products'}</span>
                </div>
                <div className="toolbar-right">
                  <div className="sort-select">
                    <label>{locale === 'fr' ? 'Trier par:' : 'Sort by:'}</label>
                    <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                      <option value="name:asc">{locale === 'fr' ? 'Nom A-Z' : 'Name A-Z'}</option>
                      <option value="name:desc">{locale === 'fr' ? 'Nom Z-A' : 'Name Z-A'}</option>
                      <option value="price:asc">{locale === 'fr' ? 'Prix: Bas \u00e0 \u00c9lev\u00e9' : 'Price: Low to High'}</option>
                      <option value="price:desc">{locale === 'fr' ? 'Prix: \u00c9lev\u00e9 \u00e0 Bas' : 'Price: High to Low'}</option>
                      <option value="createdAt:desc">{locale === 'fr' ? 'Nouveaut\u00e9s' : 'Newest'}</option>
                    </select>
                  </div>
                  <div className="view-toggle">
                    <button
                      className={viewMode === 'grid' ? 'active' : ''}
                      onClick={() => setViewMode('grid')}
                      aria-label="Vue grille"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                      </svg>
                    </button>
                    <button
                      className={viewMode === 'list' ? 'active' : ''}
                      onClick={() => setViewMode('list')}
                      aria-label="Vue liste"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="4" width="18" height="4"/>
                        <rect x="3" y="10" width="18" height="4"/>
                        <rect x="3" y="16" width="18" height="4"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {products.length === 0 ? (
                <div className="empty-state">
                  <p>{locale === 'fr' ? 'Aucun produit trouv\u00e9 dans cette cat\u00e9gorie.' : 'No products found in this category.'}</p>
                </div>
              ) : (
                <div className={`products-grid products-grid--${viewMode}`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} locale={locale} viewMode={viewMode} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {products.length > 0 && renderPagination()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
