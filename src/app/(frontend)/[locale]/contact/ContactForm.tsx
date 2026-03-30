'use client'

import { useState, type FormEvent } from 'react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  orderNumber: string
}

export default function ContactForm({ locale }: { locale: string }) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    orderNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, formType: 'contact' }),
      })
    } catch {
      // silent
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="form-success">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3>{locale === 'fr' ? 'Message envoye!' : 'Message sent!'}</h3>
        <p>{locale === 'fr' ? 'Merci de nous avoir contactes. Nous vous repondrons dans les 24 a 48 heures.' : 'Thank you for contacting us. We will respond within 24 to 48 hours.'}</p>
        <button className="btn btn--primary" onClick={() => setIsSubmitted(false)}>
          {locale === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">{locale === 'fr' ? 'Nom complet *' : 'Full Name *'}</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{locale === 'fr' ? 'Courriel *' : 'Email *'}</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">{locale === 'fr' ? 'Telephone' : 'Phone'}</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">{locale === 'fr' ? 'Sujet *' : 'Subject *'}</label>
          <select
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          >
            <option value="general">{locale === 'fr' ? 'Question generale' : 'General question'}</option>
            <option value="order">{locale === 'fr' ? 'Suivi de commande' : 'Order tracking'}</option>
            <option value="return">{locale === 'fr' ? 'Retour / Echange' : 'Return / Exchange'}</option>
            <option value="product">{locale === 'fr' ? 'Question produit' : 'Product question'}</option>
            <option value="technical">{locale === 'fr' ? 'Support technique' : 'Technical support'}</option>
            <option value="partnership">{locale === 'fr' ? 'Partenariat' : 'Partnership'}</option>
            <option value="other">{locale === 'fr' ? 'Autre' : 'Other'}</option>
          </select>
        </div>
      </div>

      {formData.subject === 'order' && (
        <div className="form-group">
          <label htmlFor="orderNumber">{locale === 'fr' ? 'Numero de commande' : 'Order number'}</label>
          <input
            type="text"
            id="orderNumber"
            value={formData.orderNumber}
            onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
            placeholder="Ex: ORD-2024-12345"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
        ></textarea>
      </div>

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            {locale === 'fr' ? 'Envoi en cours...' : 'Sending...'}
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {locale === 'fr' ? 'Envoyer le message' : 'Send message'}
          </>
        )}
      </button>
    </form>
  )
}
