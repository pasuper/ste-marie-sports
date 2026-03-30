import { getPayload, asLocale } from '@/lib/payload'
import Link from 'next/link'

export const revalidate = 3600

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Try to fetch CMS content for override
  let cmsContent: any = null
  try {
    const page = await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, locale: loc, limit: 1 })
    cmsContent = page.docs[0] || null
  } catch {}

  const mainServices = [
    {
      id: 1,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      title: locale === 'fr' ? 'Entretien regulier' : 'Regular Maintenance',
      description: locale === 'fr' ? 'Gardez votre vehicule en parfait etat avec nos services d\'entretien preventif.' : 'Keep your vehicle in perfect condition with our preventive maintenance services.',
      services: locale === 'fr' ? [
        'Changement d\'huile et filtres',
        'Inspection des points de securite',
        'Reglage et ajustement des freins',
        'Verification des courroies et chaines',
        'Lubrification complete',
        'Mise a niveau des fluides'
      ] : [
        'Oil and filter change',
        'Safety inspection',
        'Brake adjustment',
        'Belt and chain check',
        'Complete lubrication',
        'Fluid top-up'
      ]
    },
    {
      id: 2,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      title: locale === 'fr' ? 'Reparation moteur' : 'Engine Repair',
      description: locale === 'fr' ? 'Nos techniciens certifies diagnostiquent et reparent tous types de problemes moteur.' : 'Our certified technicians diagnose and repair all types of engine problems.',
      services: locale === 'fr' ? [
        'Diagnostic electronique complet',
        'Reparation et remise a neuf de moteur',
        'Remplacement de joints et segments',
        'Carburation et injection',
        'Systeme de refroidissement',
        'Systeme d\'echappement'
      ] : [
        'Complete electronic diagnostic',
        'Engine repair and rebuild',
        'Gasket and seal replacement',
        'Carburetion and injection',
        'Cooling system',
        'Exhaust system'
      ]
    },
    {
      id: 3,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ),
      title: 'Transmission & CVT',
      description: locale === 'fr' ? 'Specialistes de la transmission CVT pour motoneiges, VTT et cote-a-cote.' : 'CVT transmission specialists for snowmobiles, ATVs and side-by-sides.',
      services: locale === 'fr' ? [
        'Diagnostic de transmission',
        'Remplacement de courroie CVT',
        'Reparation de variateur',
        'Ajustement des embrayages',
        'Reparation boite de vitesses',
        'Remplacement de differentiel'
      ] : [
        'Transmission diagnostic',
        'CVT belt replacement',
        'Variator repair',
        'Clutch adjustment',
        'Gearbox repair',
        'Differential replacement'
      ]
    },
    {
      id: 4,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4l2 2"/>
          <path d="M8.5 8.5L12 12l3.5 3.5"/>
        </svg>
      ),
      title: locale === 'fr' ? 'Suspension & Direction' : 'Suspension & Steering',
      description: locale === 'fr' ? 'Optimisez la tenue de route et le confort de votre vehicule recreatif.' : 'Optimize the handling and comfort of your recreational vehicle.',
      services: locale === 'fr' ? [
        'Reparation d\'amortisseurs',
        'Remplacement de ressorts',
        'Alignement et geometrie',
        'Reparation de direction',
        'Roulement de roue',
        'Bras de suspension'
      ] : [
        'Shock absorber repair',
        'Spring replacement',
        'Alignment and geometry',
        'Steering repair',
        'Wheel bearing',
        'Suspension arm'
      ]
    },
    {
      id: 5,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      title: locale === 'fr' ? 'Systeme electrique' : 'Electrical System',
      description: locale === 'fr' ? 'Diagnostic et reparation de tous les composants electriques et electroniques.' : 'Diagnostic and repair of all electrical and electronic components.',
      services: locale === 'fr' ? [
        'Diagnostic systeme electrique',
        'Remplacement de batterie',
        'Reparation alternateur/stator',
        'Systeme de demarrage',
        'Eclairage et accessoires',
        'Installation GPS et audio'
      ] : [
        'Electrical system diagnostic',
        'Battery replacement',
        'Alternator/stator repair',
        'Starting system',
        'Lighting and accessories',
        'GPS and audio installation'
      ]
    },
    {
      id: 6,
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: locale === 'fr' ? 'Freins & Securite' : 'Brakes & Safety',
      description: locale === 'fr' ? 'Ne compromettez jamais votre securite. Faites verifier vos freins regulierement.' : 'Never compromise your safety. Have your brakes checked regularly.',
      services: locale === 'fr' ? [
        'Remplacement plaquettes et disques',
        'Purge du systeme de freinage',
        'Reparation etrier de frein',
        'Frein a main et parking',
        'Systeme ABS',
        'Inspection de securite complete'
      ] : [
        'Pad and disc replacement',
        'Brake system bleeding',
        'Brake caliper repair',
        'Parking brake',
        'ABS system',
        'Complete safety inspection'
      ]
    }
  ]

  const vehicleTypes = [
    { name: locale === 'fr' ? 'Motoneiges' : 'Snowmobiles', icon: '\u2744\uFE0F', brands: ['Ski-Doo', 'Yamaha', 'Polaris', 'Arctic Cat'] },
    { name: 'VTT / Quads', icon: '\uD83C\uDFD4\uFE0F', brands: ['Can-Am', 'Yamaha', 'Honda', 'Polaris'] },
    { name: locale === 'fr' ? 'Cote-a-cote' : 'Side-by-side', icon: '\uD83D\uDE99', brands: ['Can-Am', 'Polaris', 'Yamaha', 'Honda'] },
    { name: locale === 'fr' ? 'Motocyclettes' : 'Motorcycles', icon: '\uD83C\uDFCD\uFE0F', brands: ['Yamaha', 'Honda', 'Kawasaki', 'Suzuki'] },
    { name: 'Motomarines', icon: '\uD83C\uDF0A', brands: ['Sea-Doo', 'Yamaha', 'Kawasaki'] },
    { name: locale === 'fr' ? 'Vehicules electriques' : 'Electric vehicles', icon: '\u26A1', brands: ['Zero', 'Energica', 'Sur-Ron'] },
  ]

  const seasonalServices = [
    {
      title: locale === 'fr' ? 'Preparation hivernale' : 'Winter Preparation',
      icon: '\u2744\uFE0F',
      description: locale === 'fr' ? 'Preparez votre motoneige pour la saison avec notre inspection 25 points.' : 'Prepare your snowmobile for the season with our 25-point inspection.',
      items: locale === 'fr' ? ['Verification moteur', 'Inspection chenilles', 'Lubrification complete', 'Test de performance'] : ['Engine check', 'Track inspection', 'Complete lubrication', 'Performance test']
    },
    {
      title: locale === 'fr' ? 'Remisage ete' : 'Summer Storage',
      icon: '\u2600\uFE0F',
      description: locale === 'fr' ? 'Entreposage securise avec preparation complete pour la saison morte.' : 'Secure storage with complete off-season preparation.',
      items: locale === 'fr' ? ['Stabilisation carburant', 'Protection anticorrosion', 'Charge batterie', 'Entreposage climat controle'] : ['Fuel stabilization', 'Anti-corrosion protection', 'Battery charging', 'Climate-controlled storage']
    },
    {
      title: locale === 'fr' ? 'Preparation printemps' : 'Spring Preparation',
      icon: '\uD83C\uDF38',
      description: locale === 'fr' ? 'Sortez votre VTT ou moto de l\'hibernation en toute confiance.' : 'Bring your ATV or motorcycle out of hibernation with confidence.',
      items: locale === 'fr' ? ['Inspection complete', 'Changement d\'huile', 'Verification freins', 'Test route'] : ['Complete inspection', 'Oil change', 'Brake check', 'Road test']
    },
    {
      title: locale === 'fr' ? 'Preparation automne' : 'Fall Preparation',
      icon: '\uD83C\uDF42',
      description: locale === 'fr' ? 'Preparez votre motoneige avant les premieres neiges.' : 'Prepare your snowmobile before the first snowfall.',
      items: locale === 'fr' ? ['Revision moteur', 'Ajustement suspension', 'Verification ski et chenilles', 'Mise au point'] : ['Engine revision', 'Suspension adjustment', 'Ski and track check', 'Tune-up']
    }
  ]

  return (
    <div className="services-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>{locale === 'fr' ? 'Service & Mecanique' : 'Service & Mechanics'}</h1>
          <p>{locale === 'fr' ? 'Atelier de reparation et d\'entretien pour vehicules recreatifs' : 'Repair and maintenance shop for recreational vehicles'}</p>
          <nav className="header-breadcrumb" aria-label="Fil d'Ariane">
            <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6"/>
            </svg>
            <span>Services</span>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Intro Section */}
          <section className="services-intro">
            <div className="intro-text">
              <h2>{locale === 'fr' ? 'Votre atelier de confiance' : 'Your trusted workshop'}</h2>
              <p>
                {locale === 'fr'
                  ? 'Notre equipe de techniciens certifies possede plus de 50 ans d\'experience combinee dans l\'entretien et la reparation de vehicules recreatifs. Que ce soit pour un entretien regulier ou une reparation majeure, nous avons l\'expertise pour remettre votre vehicule sur la route, les sentiers ou la neige.'
                  : 'Our team of certified technicians has over 50 years of combined experience in recreational vehicle maintenance and repair. Whether it\'s regular maintenance or a major repair, we have the expertise to get your vehicle back on the road, trails or snow.'}
              </p>
              <p>
                {locale === 'fr'
                  ? 'Nous utilisons des pieces d\'origine et des outils de diagnostic de pointe pour garantir un travail de qualite. Tous nos travaux sont couverts par notre garantie satisfaction.'
                  : 'We use OEM parts and state-of-the-art diagnostic tools to ensure quality work. All our work is covered by our satisfaction guarantee.'}
              </p>
            </div>
            <div className="intro-highlights">
              <div className="highlight">
                <span className="highlight-number">15+</span>
                <span className="highlight-label">{locale === 'fr' ? 'Techniciens certifies' : 'Certified technicians'}</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">5,000+</span>
                <span className="highlight-label">{locale === 'fr' ? 'Vehicules entretenus/an' : 'Vehicles serviced/year'}</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">98%</span>
                <span className="highlight-label">{locale === 'fr' ? 'Satisfaction client' : 'Customer satisfaction'}</span>
              </div>
            </div>
          </section>

          {/* Vehicle Types */}
          <section className="vehicle-types-section">
            <h2>{locale === 'fr' ? 'Vehicules que nous entretenons' : 'Vehicles We Service'}</h2>
            <div className="vehicle-types-grid">
              {vehicleTypes.map((type, index) => (
                <div key={index} className="vehicle-type-card">
                  <span className="vehicle-icon">{type.icon}</span>
                  <h3>{type.name}</h3>
                  <div className="vehicle-brands">
                    {type.brands.map((brand, i) => (
                      <span key={i} className="brand-tag">{brand}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Services Grid */}
          <section className="main-services-section">
            <h2>{locale === 'fr' ? 'Nos services mecaniques' : 'Our Mechanical Services'}</h2>
            <div className="services-grid">
              {mainServices.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-list">
                    {service.services.map((item, index) => (
                      <li key={index}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Seasonal Services */}
          <section className="seasonal-section">
            <h2>{locale === 'fr' ? 'Services saisonniers' : 'Seasonal Services'}</h2>
            <div className="seasonal-grid">
              {seasonalServices.map((service, index) => (
                <div key={index} className="seasonal-card">
                  <div className="seasonal-header">
                    <span className="seasonal-icon">{service.icon}</span>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.description}</p>
                  <ul>
                    {service.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Appointment CTA */}
          <section className="appointment-cta">
            <div className="cta-content">
              <h2>{locale === 'fr' ? 'Prenez rendez-vous' : 'Book an Appointment'}</h2>
              <p>
                {locale === 'fr'
                  ? 'Reservez votre rendez-vous en ligne ou appelez-nous directement. Nous offrons un service de pick-up gratuit dans un rayon de 30 km.'
                  : 'Book your appointment online or call us directly. We offer free pick-up service within a 30 km radius.'}
              </p>
              <div className="cta-buttons">
                <Link href={`/${locale}/contact`} className="cta-btn primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {locale === 'fr' ? 'Prendre rendez-vous' : 'Book appointment'}
                </Link>
                <a href="tel:+15141234567" className="cta-btn secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  (514) 123-4567
                </a>
              </div>
              <p className="cta-hours">
                <strong>{locale === 'fr' ? 'Heures d\'ouverture:' : 'Business hours:'}</strong> {locale === 'fr' ? 'Lun-Ven 8h-18h | Sam 9h-16h' : 'Mon-Fri 8am-6pm | Sat 9am-4pm'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
