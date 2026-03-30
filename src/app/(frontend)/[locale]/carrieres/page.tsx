'use client'

import { use, useState } from 'react'
import Link from 'next/link'

interface JobPosting {
  id: number
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string[]
  postedDate: string
}

export default function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const jobs: JobPosting[] = [
    {
      id: 1,
      title: 'Conseiller aux ventes - V\u00e9hicules r\u00e9cr\u00e9atifs',
      department: 'Ventes',
      location: 'Montr\u00e9al, QC',
      type: 'full-time',
      description: 'Rejoignez notre \u00e9quipe de vente dynamique et aidez nos clients \u00e0 trouver le v\u00e9hicule r\u00e9cr\u00e9atif de leurs r\u00eaves.',
      requirements: [
        'Exp\u00e9rience en vente (atout)',
        'Passion pour les v\u00e9hicules r\u00e9cr\u00e9atifs',
        'Excellentes comp\u00e9tences en communication',
        'Permis de conduire valide'
      ],
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Technicien m\u00e9canicien certifi\u00e9',
      department: 'Service',
      location: 'Montr\u00e9al, QC',
      type: 'full-time',
      description: 'Nous recherchons un technicien qualifi\u00e9 pour l\'entretien et la r\u00e9paration de motoneiges, VTT et c\u00f4te-\u00e0-c\u00f4te.',
      requirements: [
        'DEP en m\u00e9canique de v\u00e9hicules r\u00e9cr\u00e9atifs',
        '2+ ann\u00e9es d\'exp\u00e9rience',
        'Certifications BRP/Yamaha (atout)',
        'Capacit\u00e9 \u00e0 travailler en \u00e9quipe'
      ],
      postedDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'Responsable des pi\u00e8ces et accessoires',
      department: 'Pi\u00e8ces',
      location: 'Montr\u00e9al, QC',
      type: 'full-time',
      description: 'G\u00e9rez notre d\u00e9partement de pi\u00e8ces et accessoires et assurez un service client exceptionnel.',
      requirements: [
        'Connaissance des pi\u00e8ces de v\u00e9hicules r\u00e9cr\u00e9atifs',
        'Exp\u00e9rience en gestion d\'inventaire',
        'Comp\u00e9tences informatiques',
        'Service client exemplaire'
      ],
      postedDate: '2024-01-08'
    },
    {
      id: 4,
      title: 'Repr\u00e9sentant service \u00e0 la client\u00e8le',
      department: 'Service client',
      location: 'Montr\u00e9al, QC',
      type: 'part-time',
      description: 'Offrez un support exceptionnel \u00e0 nos clients par t\u00e9l\u00e9phone, courriel et en personne.',
      requirements: [
        'Bilingue (fran\u00e7ais/anglais)',
        'Excellentes aptitudes en communication',
        'Exp\u00e9rience en service client',
        'Attitude positive'
      ],
      postedDate: '2024-01-05'
    },
    {
      id: 5,
      title: 'Sp\u00e9cialiste marketing digital',
      department: 'Marketing',
      location: 'Montr\u00e9al, QC',
      type: 'full-time',
      description: 'D\u00e9veloppez et ex\u00e9cutez notre strat\u00e9gie de marketing digital pour augmenter notre pr\u00e9sence en ligne.',
      requirements: [
        'Baccalaur\u00e9at en marketing ou domaine connexe',
        'Exp\u00e9rience avec Google Ads, Meta Ads',
        'Connaissance SEO/SEM',
        'Cr\u00e9ativit\u00e9 et initiative'
      ],
      postedDate: '2024-01-03'
    },
    {
      id: 6,
      title: 'Pr\u00e9parateur de v\u00e9hicules (saisonnier)',
      department: 'Service',
      location: 'Montr\u00e9al, QC',
      type: 'contract',
      description: 'Pr\u00e9parez les v\u00e9hicules neufs et d\'occasion pour la livraison aux clients.',
      requirements: [
        'Int\u00e9r\u00eat pour les v\u00e9hicules r\u00e9cr\u00e9atifs',
        'Capacit\u00e9 physique',
        'Souci du d\u00e9tail',
        'Disponibilit\u00e9 saisonni\u00e8re'
      ],
      postedDate: '2024-01-01'
    }
  ]

  const departments = ['all', ...new Set(jobs.map(job => job.department))]
  const types = ['all', 'full-time', 'part-time', 'contract']

  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesType = selectedType === 'all' || job.type === selectedType
    return matchesDepartment && matchesType
  })

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Temps plein'
      case 'part-time': return 'Temps partiel'
      case 'contract': return 'Contractuel'
      default: return type
    }
  }

  const benefits = [
    { icon: '\ud83d\udcb0', title: 'Salaire comp\u00e9titif', description: 'R\u00e9mun\u00e9ration attractive selon l\'exp\u00e9rience' },
    { icon: '\ud83c\udfe5', title: 'Assurance collective', description: 'Couverture sant\u00e9 compl\u00e8te pour vous et votre famille' },
    { icon: '\ud83c\udfaf', title: 'Bonus performance', description: 'Programme de bonification bas\u00e9 sur les r\u00e9sultats' },
    { icon: '\ud83d\udcda', title: 'Formation continue', description: 'D\u00e9veloppement professionnel et certifications' },
    { icon: '\ud83c\udfcd\ufe0f', title: 'Rabais employ\u00e9', description: 'R\u00e9ductions sur les produits et services' },
    { icon: '\ud83c\udf34', title: 'Vacances g\u00e9n\u00e9reuses', description: 'Temps de repos bien m\u00e9rit\u00e9' }
  ]

  return (
    <div className="careers-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Carri\u00e8res</h1>
          <p>Joignez-vous \u00e0 une \u00e9quipe passionn\u00e9e par les sports motoris\u00e9s</p>
          <nav className="header-breadcrumb" aria-label="Fil d'Ariane">
            <Link href={`/${locale}`}>Accueil</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18L15 12L9 6"/>
            </svg>
            <span>Carri\u00e8res</span>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Introduction */}
          <section className="careers-intro">
            <div className="intro-content">
              <h2>Pourquoi travailler chez Ste-Marie Sports?</h2>
              <p>
                Chez Ste-Marie Sports, nous sommes plus qu&apos;une \u00e9quipe &ndash; nous sommes une famille unie par notre passion
                pour les v\u00e9hicules r\u00e9cr\u00e9atifs. Depuis plus de 20 ans, nous aidons les Qu\u00e9b\u00e9cois \u00e0 vivre leurs
                aventures en plein air avec les meilleurs \u00e9quipements du march\u00e9.
              </p>
              <p>
                Nous recherchons des personnes enthousiastes qui partagent notre passion et notre engagement
                envers l&apos;excellence du service client. Que vous soyez un expert en m\u00e9canique, un vendeur n\u00e9
                ou un sp\u00e9cialiste du service \u00e0 la client\u00e8le, il y a une place pour vous dans notre \u00e9quipe.
              </p>
            </div>
            <div className="intro-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Employ\u00e9s</span>
              </div>
              <div className="stat">
                <span className="stat-number">20+</span>
                <span className="stat-label">Ann\u00e9es d&apos;exp\u00e9rience</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8&#9733;</span>
                <span className="stat-label">Note employeur</span>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="careers-benefits">
            <h2>Nos avantages</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <span className="benefit-icon">{benefit.icon}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Job Listings */}
          <section className="job-listings">
            <div className="listings-header">
              <h2>Postes disponibles</h2>
              <div className="listings-filters">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">Tous les d\u00e9partements</option>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  {types.filter(t => t !== 'all').map(type => (
                    <option key={type} value={type}>{getTypeLabel(type)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="jobs-count">
              {filteredJobs.length} poste{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}
            </div>

            {filteredJobs.length > 0 ? (
              <div className="jobs-list">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-card__header">
                      <div className="job-card__title">
                        <h3>{job.title}</h3>
                        <div className="job-card__meta">
                          <span className="department">{job.department}</span>
                          <span className="location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {job.location}
                          </span>
                          <span className={`type type--${job.type}`}>{getTypeLabel(job.type)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="job-card__description">{job.description}</p>
                    <div className="job-card__requirements">
                      <h4>Exigences:</h4>
                      <ul>
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="job-card__footer">
                      <span className="posted-date">Publi\u00e9 le {new Date(job.postedDate).toLocaleDateString('fr-CA')}</span>
                      <button className="apply-btn">Postuler maintenant</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-jobs">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
                <h3>Aucun poste disponible</h3>
                <p>Aucun poste ne correspond \u00e0 vos crit\u00e8res actuellement.</p>
              </div>
            )}
          </section>

          {/* Spontaneous Application */}
          <section className="spontaneous-application">
            <div className="spontaneous-content">
              <h2>Candidature spontan\u00e9e</h2>
              <p>
                Vous ne trouvez pas le poste id\u00e9al? Envoyez-nous votre CV et nous vous contacterons
                d\u00e8s qu&apos;une opportunit\u00e9 correspondant \u00e0 votre profil se pr\u00e9sentera.
              </p>
              <a href="mailto:carrieres@ste-marie.ca" className="spontaneous-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Envoyer ma candidature
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
