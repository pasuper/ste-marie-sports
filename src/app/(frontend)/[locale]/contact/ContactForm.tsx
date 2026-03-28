'use client'
import { useState } from 'react'

export default function ContactForm({ locale }: { locale: string }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, formType: 'contact' }),
      })
      setStatus('sent')
      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
    } catch { setStatus('error') }
  }

  if (status === 'sent') return <p className="alert alert--success">{locale === 'fr' ? 'Message envoyé avec succès!' : 'Message sent successfully!'}</p>

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form__row">
        <input type="text" placeholder={locale === 'fr' ? 'Prénom' : 'First Name'} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required className="input" />
        <input type="text" placeholder={locale === 'fr' ? 'Nom' : 'Last Name'} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required className="input" />
      </div>
      <input type="email" placeholder={locale === 'fr' ? 'Courriel' : 'Email'} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input" />
      <input type="tel" placeholder={locale === 'fr' ? 'Téléphone' : 'Phone'} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" />
      <input type="text" placeholder={locale === 'fr' ? 'Sujet' : 'Subject'} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required className="input" />
      <textarea placeholder="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required className="input textarea" rows={5} />
      <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
        {status === 'sending' ? (locale === 'fr' ? 'Envoi...' : 'Sending...') : (locale === 'fr' ? 'Envoyer' : 'Send')}
      </button>
      {status === 'error' && <p className="alert alert--error">{locale === 'fr' ? 'Erreur. Veuillez réessayer.' : 'Error. Please try again.'}</p>}
    </form>
  )
}
