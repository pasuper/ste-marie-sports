'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { t } from '@/lib/i18n'

interface HeroTabsProps {
  locale: string
}

export default function HeroTabs({ locale }: HeroTabsProps) {
  const router = useRouter()
  const loc = locale as 'fr' | 'en'
  const [activeTab, setActiveTab] = useState('vehicles')

  // Parts Finder State
  const [partsType, setPartsType] = useState('oem')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedMakeId, setSelectedMakeId] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedTrim, setSelectedTrim] = useState('')

  // YMMT Data
  const [ymmtYears, setYmmtYears] = useState<number[]>([])
  const [ymmtMakes, setYmmtMakes] = useState<any[]>([])
  const [ymmtModels, setYmmtModels] = useState<string[]>([])
  const [ymmtSubmodels, setYmmtSubmodels] = useState<string[]>([])
  const [ymmtLoading, setYmmtLoading] = useState(false)

  // Fetch YMMT years on mount
  useEffect(() => {
    fetch(`/api/ymmt/years`)
      .then(r => r.json())
      .then(data => setYmmtYears(data.years || []))
      .catch(() => {})
  }, [])

  // Fetch makes when year changes
  useEffect(() => {
    if (!selectedYear) { setYmmtMakes([]); return }
    setYmmtLoading(true)
    fetch(`/api/ymmt/makes?year=${selectedYear}`)
      .then(r => r.json())
      .then(data => setYmmtMakes(data.makes || []))
      .catch(() => {})
      .finally(() => setYmmtLoading(false))
  }, [selectedYear])

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedYear || !selectedMakeId) { setYmmtModels([]); return }
    setYmmtLoading(true)
    fetch(`/api/ymmt/models?year=${selectedYear}&makeId=${selectedMakeId}`)
      .then(r => r.json())
      .then(data => setYmmtModels(data.models || []))
      .catch(() => {})
      .finally(() => setYmmtLoading(false))
  }, [selectedYear, selectedMakeId])

  // Fetch submodels when model changes
  useEffect(() => {
    if (!selectedYear || !selectedMakeId || !selectedModel) { setYmmtSubmodels([]); return }
    setYmmtLoading(true)
    fetch(`/api/ymmt/submodels?year=${selectedYear}&makeId=${selectedMakeId}&model=${encodeURIComponent(selectedModel)}`)
      .then(r => r.json())
      .then(data => setYmmtSubmodels(data.submodels || []))
      .catch(() => {})
      .finally(() => setYmmtLoading(false))
  }, [selectedYear, selectedMakeId, selectedModel])

  const handlePartsSearch = () => {
    if (!selectedYear || !selectedMake || !selectedModel) return
    const params = new URLSearchParams({ year: selectedYear, make: selectedMake, model: selectedModel })
    if (selectedTrim) params.set('trim', selectedTrim)
    router.push(`/${locale}/pieces?${params.toString()}`)
  }

  const vehicleTypes = [
    { id: 'sxs', name: locale === 'fr' ? 'Côte à Côte' : 'Side by Side', icon: 'M4 16V8h16v8H4zm2-6h12v4H6v-4zm1 5.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm8 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z', link: `/${locale}/vehicules?type=sxs` },
    { id: 'atv', name: 'VTT / ATV', icon: 'M5 11l2-6h10l2 6M7 11v4m10-4v4M5 15h14M9 19a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z', link: `/${locale}/vehicules?type=atv` },
    { id: 'snowmobile', name: locale === 'fr' ? 'Motoneige' : 'Snowmobile', icon: 'M3 14l3-8h12l3 8H3zm3 0v2h12v-2M8 18h8', link: `/${locale}/vehicules?type=snowmobile` },
    { id: 'motorcycle', name: locale === 'fr' ? 'Moto' : 'Motorcycle', icon: 'M5 16a3 3 0 106 0 3 3 0 00-6 0zm8 0a3 3 0 106 0 3 3 0 00-6 0zM8 13h8M6 10l2-4h4l2 4', link: `/${locale}/vehicules?type=motorcycle` },
    { id: 'dirtbike', name: 'Motocross', icon: 'M6 17a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0zm7 0a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0zM8.5 14.5l3-6h2l2 6', link: `/${locale}/vehicules?type=dirtbike` },
    { id: 'pwc', name: locale === 'fr' ? 'Motomarine' : 'Watercraft', icon: 'M3 15c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1M5 12l2-4h10l2 4H5z', link: `/${locale}/vehicules?type=pwc` },
  ]

  const accessoryCategories = [
    { id: 'helmets', name: locale === 'fr' ? 'Casques' : 'Helmets', link: `/${locale}/category/casques` },
    { id: 'jackets', name: locale === 'fr' ? 'Vestes' : 'Jackets', link: `/${locale}/category/vetements` },
    { id: 'gloves', name: locale === 'fr' ? 'Gants' : 'Gloves', link: `/${locale}/category/gants` },
    { id: 'boots', name: locale === 'fr' ? 'Bottes' : 'Boots', link: `/${locale}/category/bottes` },
    { id: 'pants', name: locale === 'fr' ? 'Pantalons' : 'Pants', link: `/${locale}/category/pantalons` },
    { id: 'protection', name: 'Protection', link: `/${locale}/category/protection` },
  ]

  return (
    <div className="hero-tabs">
      <div className="hero-tabs__nav">
        <button
          className={`hero-tabs__tab ${activeTab === 'vehicles' ? 'hero-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"/>
            <path d="M3 11l2-6h14l2 6M7 17H3v-6h18v6h-4"/>
          </svg>
          {t(loc, 'common.vehicles')}
        </button>
        <button
          className={`hero-tabs__tab ${activeTab === 'accessories' ? 'hero-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('accessories')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z"/>
            <path d="M3 10h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"/>
          </svg>
          {t(loc, 'common.accessories')}
        </button>
        <button
          className={`hero-tabs__tab ${activeTab === 'parts' ? 'hero-tabs__tab--active' : ''}`}
          onClick={() => setActiveTab('parts')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4m0 14v4m11-11h-4M5 12H1m18.07-7.07l-2.83 2.83M8.76 15.24l-2.83 2.83m12.14 0l-2.83-2.83M8.76 8.76L5.93 5.93"/>
          </svg>
          {t(loc, 'common.parts')}
        </button>
      </div>

      <div className="hero-tabs__content">
        {activeTab === 'vehicles' && (
          <div className="hero-tabs__panel hero-tabs__panel--vehicles">
            {vehicleTypes.map((vehicle) => (
              <Link key={vehicle.id} href={vehicle.link} className="hero-tabs__vehicle-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={vehicle.icon}/>
                </svg>
                <span>{vehicle.name}</span>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'accessories' && (
          <div className="hero-tabs__panel hero-tabs__panel--accessories">
            {accessoryCategories.map((cat) => (
              <Link key={cat.id} href={cat.link} className="hero-tabs__accessory-btn">
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="hero-tabs__panel hero-tabs__panel--parts">
            <div className="hero-tabs__parts-type">
              <label className={`hero-tabs__radio ${partsType === 'oem' ? 'hero-tabs__radio--active' : ''}`}>
                <input type="radio" name="heroPartsType" value="oem" checked={partsType === 'oem'} onChange={(e) => setPartsType(e.target.value)} />
                <span>{t(loc, 'partsFinder.oem')}</span>
              </label>
              <label className={`hero-tabs__radio ${partsType === 'aftermarket' ? 'hero-tabs__radio--active' : ''}`}>
                <input type="radio" name="heroPartsType" value="aftermarket" checked={partsType === 'aftermarket'} onChange={(e) => setPartsType(e.target.value)} />
                <span>{t(loc, 'partsFinder.aftermarket')}</span>
              </label>
            </div>
            <div className="hero-tabs__parts-selects">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value)
                  setSelectedMake('')
                  setSelectedMakeId('')
                  setSelectedModel('')
                  setSelectedTrim('')
                }}
              >
                <option value="">{t(loc, 'partsFinder.year')}</option>
                {ymmtYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={selectedMake}
                onChange={(e) => {
                  const make = ymmtMakes.find((m: any) => m.name === e.target.value)
                  setSelectedMake(e.target.value)
                  setSelectedMakeId(make?.id || '')
                  setSelectedModel('')
                  setSelectedTrim('')
                }}
                disabled={!selectedYear || ymmtLoading}
              >
                <option value="">{ymmtLoading ? '...' : t(loc, 'partsFinder.make')}</option>
                {ymmtMakes.map((make: any) => (
                  <option key={make.id} value={make.name}>{make.name}</option>
                ))}
              </select>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value)
                  setSelectedTrim('')
                }}
                disabled={!selectedMake || ymmtLoading}
              >
                <option value="">{ymmtLoading ? '...' : t(loc, 'partsFinder.model')}</option>
                {ymmtModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <select
                value={selectedTrim}
                onChange={(e) => setSelectedTrim(e.target.value)}
                disabled={!selectedModel || ymmtSubmodels.length === 0}
              >
                <option value="">{t(loc, 'partsFinder.trim')}</option>
                {ymmtSubmodels.map((trim) => (
                  <option key={trim} value={trim}>{trim}</option>
                ))}
              </select>
              <button
                className="hero-tabs__search-btn"
                disabled={!selectedYear || !selectedMake || !selectedModel}
                onClick={handlePartsSearch}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
