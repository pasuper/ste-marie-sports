import { getPayload, asLocale } from '@/lib/payload'
import Link from 'next/link'

export const revalidate = 3600

export default async function AboutUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = asLocale(locale)
  const payload = await getPayload()

  // Try to fetch CMS content, use hardcoded structure as fallback
  let cmsContent: any = null
  try {
    const page = await payload.find({ collection: 'pages', where: { slug: { equals: 'a-propos' } }, locale: loc, limit: 1 })
    cmsContent = page.docs[0] || null
  } catch {}

  const milestones = [
    { year: '2003', title: 'Fondation', description: 'Ouverture de notre premier magasin a Montreal avec une passion pour les motoneiges.' },
    { year: '2008', title: 'Expansion VTT', description: 'Ajout de la gamme complete de VTT et cote-a-cote a notre offre.' },
    { year: '2012', title: 'Centre de service', description: 'Inauguration de notre atelier de reparation certifie multi-marques.' },
    { year: '2016', title: 'Commerce en ligne', description: 'Lancement de notre boutique en ligne pour servir tout le Quebec.' },
    { year: '2020', title: 'Agrandissement', description: 'Demenagement dans nos nouvelles installations de 25,000 pieds carres.' },
    { year: '2024', title: 'Innovation', description: 'Lancement de notre plateforme digitale nouvelle generation.' }
  ]

  const team = [
    {
      name: 'Jean-Pierre Tremblay',
      role: 'President fondateur',
      image: 'https://placehold.co/300x300/1a1a1a/ffffff?text=JP',
      description: 'Passionne de motoneige depuis 30 ans'
    },
    {
      name: 'Marie-Claude Gagnon',
      role: 'Directrice des operations',
      image: 'https://placehold.co/300x300/1a1a1a/ffffff?text=MC',
      description: '15 ans d\'experience en gestion'
    },
    {
      name: 'Francois Lavoie',
      role: 'Chef mecanicien',
      image: 'https://placehold.co/300x300/1a1a1a/ffffff?text=FL',
      description: 'Expert certifie BRP et Yamaha'
    },
    {
      name: 'Sophie Bergeron',
      role: 'Responsable service client',
      image: 'https://placehold.co/300x300/1a1a1a/ffffff?text=SB',
      description: 'Devouee a votre satisfaction'
    }
  ]

  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>{locale === 'fr' ? 'A propos de nous' : 'About Us'}</h1>
          <p>{locale === 'fr' ? 'Votre partenaire de confiance en sports motorises depuis 2003' : 'Your trusted partner in motorsports since 2003'}</p>
          <nav className="header-breadcrumb" aria-label="Fil d'Ariane">
            <Link href={`/${locale}`}>{locale === 'fr' ? 'Accueil' : 'Home'}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6"/>
            </svg>
            <span>{locale === 'fr' ? 'A propos' : 'About'}</span>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Story Section */}
          <section className="about-story">
            <div className="story-content">
              <h2>{locale === 'fr' ? 'Notre histoire' : 'Our Story'}</h2>
              <p>
                {locale === 'fr'
                  ? 'Fondee en 2003 par Jean-Pierre Tremblay, un passionne de motoneige depuis son enfance, Ste-Marie Sports est nee d\'un reve simple : partager la passion des sports motorises avec les Quebecois et leur offrir les meilleurs produits et services disponibles sur le marche.'
                  : 'Founded in 2003 by Jean-Pierre Tremblay, a lifelong snowmobile enthusiast, Ste-Marie Sports was born from a simple dream: sharing the passion for motorsports with Quebecers and offering them the best products and services available on the market.'}
              </p>
              <p>
                {locale === 'fr'
                  ? 'Ce qui a commence comme un petit magasin specialise en motoneiges est devenu au fil des annees l\'une des destinations les plus completes pour les amateurs de vehicules recreatifs au Quebec. Notre engagement envers la qualite et le service a la clientele nous a permis de batir une reputation solide et une clientele fidele.'
                  : 'What started as a small snowmobile specialty shop has grown over the years into one of the most complete destinations for recreational vehicle enthusiasts in Quebec. Our commitment to quality and customer service has allowed us to build a solid reputation and a loyal clientele.'}
              </p>
              <p>
                {locale === 'fr'
                  ? 'Aujourd\'hui, avec plus de 50 employes passionnes et un inventaire de milliers de produits, nous continuons a innover et a nous adapter aux besoins de notre communaute, tout en restant fideles a nos valeurs fondatrices.'
                  : 'Today, with over 50 passionate employees and an inventory of thousands of products, we continue to innovate and adapt to the needs of our community, while staying true to our founding values.'}
              </p>
            </div>
            <div className="story-image">
              <img src="https://placehold.co/600x400/1a1a1a/ffffff?text=Notre+Histoire" alt={locale === 'fr' ? 'Notre histoire' : 'Our Story'} />
            </div>
          </section>

          {/* Stats Section */}
          <section className="about-stats">
            <div className="stat-item">
              <span className="stat-number">20+</span>
              <span className="stat-label">{locale === 'fr' ? 'Annees d\'experience' : 'Years of experience'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">{locale === 'fr' ? 'Employes passionnes' : 'Passionate employees'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">{locale === 'fr' ? 'Clients satisfaits' : 'Satisfied customers'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">{locale === 'fr' ? 'Marques partenaires' : 'Partner brands'}</span>
            </div>
          </section>

          {/* Values Section */}
          <section className="about-values">
            <h2>{locale === 'fr' ? 'Nos valeurs' : 'Our Values'}</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </div>
                <h3>Passion</h3>
                <p>{locale === 'fr' ? 'Nous vivons et respirons les sports motorises. Notre enthousiasme se reflete dans chaque interaction.' : 'We live and breathe motorsports. Our enthusiasm is reflected in every interaction.'}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3>{locale === 'fr' ? 'Integrite' : 'Integrity'}</h3>
                <p>{locale === 'fr' ? 'Transparence et honnetete sont au coeur de nos valeurs. Nous traitons chaque client comme un membre de notre famille.' : 'Transparency and honesty are at the heart of our values. We treat every customer like family.'}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </div>
                <h3>Service</h3>
                <p>{locale === 'fr' ? 'Votre satisfaction est notre priorite. Nous allons au-dela pour vous offrir une experience exceptionnelle.' : 'Your satisfaction is our priority. We go above and beyond to offer you an exceptional experience.'}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h3>Excellence</h3>
                <p>{locale === 'fr' ? 'Nous visons l\'excellence dans tout ce que nous faisons, des produits que nous vendons au service que nous offrons.' : 'We strive for excellence in everything we do, from the products we sell to the service we provide.'}</p>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="about-timeline">
            <h2>{locale === 'fr' ? 'Notre parcours' : 'Our Journey'}</h2>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <span className="timeline-year">{milestone.year}</span>
                  </div>
                  <div className="timeline-content">
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="about-team">
            <h2>{locale === 'fr' ? 'Notre equipe de direction' : 'Our Leadership Team'}</h2>
            <p className="team-intro">
              {locale === 'fr' ? 'Des professionnels passionnes qui travaillent chaque jour pour vous offrir le meilleur service.' : 'Passionate professionals who work every day to offer you the best service.'}
            </p>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <span className="team-role">{member.role}</span>
                    <p>{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="about-cta">
            <div className="cta-content">
              <h2>{locale === 'fr' ? 'Venez nous rencontrer!' : 'Come meet us!'}</h2>
              <p>
                {locale === 'fr'
                  ? 'Visitez notre magasin et decouvrez pourquoi des milliers de clients nous font confiance depuis plus de 20 ans.'
                  : 'Visit our store and discover why thousands of customers have trusted us for over 20 years.'}
              </p>
              <div className="cta-buttons">
                <Link href={`/${locale}/contact`} className="cta-btn primary">{locale === 'fr' ? 'Nous contacter' : 'Contact us'}</Link>
                <Link href={`/${locale}/vehicules`} className="cta-btn secondary">{locale === 'fr' ? 'Voir nos vehicules' : 'See our vehicles'}</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
