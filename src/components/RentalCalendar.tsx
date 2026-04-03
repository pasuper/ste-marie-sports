'use client'

import { useState } from 'react'

interface RentalCalendarProps {
  blockedDates: string[]
  onDateSelect: (date: string) => void
  selectedDate: string | null
  locale: string
}

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday = 0, Sunday = 6
  let startPad = firstDay.getDay() - 1
  if (startPad < 0) startPad = 6

  const days: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  return days
}

export default function RentalCalendar({ blockedDates, onDateSelect, selectedDate, locale }: RentalCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [baseMonth, setBaseMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const months = locale === 'fr' ? MONTHS_FR : MONTHS_EN
  const dayNames = locale === 'fr' ? DAYS_FR : DAYS_EN

  const blockedSet = new Set(blockedDates.map(d => d.split('T')[0]))

  const prevMonth = () => {
    const p = new Date(baseMonth)
    p.setMonth(p.getMonth() - 1)
    if (p >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setBaseMonth(p)
    }
  }

  const nextMonth = () => {
    const n = new Date(baseMonth)
    n.setMonth(n.getMonth() + 1)
    setBaseMonth(n)
  }

  const renderMonth = (year: number, month: number) => {
    const days = getMonthDays(year, month)
    return (
      <div className="rental-calendar__month">
        <div className="rental-calendar__month-title">
          {months[month]} {year}
        </div>
        <div className="rental-calendar__day-names">
          {dayNames.map(d => <div key={d} className="rental-calendar__day-name">{d}</div>)}
        </div>
        <div className="rental-calendar__days">
          {days.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="rental-calendar__day rental-calendar__day--empty" />
            const dateStr = toDateStr(day)
            const isPast = day < today
            const isBlocked = blockedSet.has(dateStr)
            const isSelected = selectedDate === dateStr
            const isAvailable = !isPast && !isBlocked

            let cls = 'rental-calendar__day'
            if (isPast) cls += ' rental-calendar__day--past'
            else if (isBlocked) cls += ' rental-calendar__day--blocked'
            else cls += ' rental-calendar__day--available'
            if (isSelected) cls += ' rental-calendar__day--selected'

            return (
              <button
                key={dateStr}
                className={cls}
                disabled={!isAvailable}
                onClick={() => isAvailable && onDateSelect(dateStr)}
                type="button"
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const month2 = new Date(baseMonth)
  month2.setMonth(month2.getMonth() + 1)

  return (
    <div className="rental-calendar">
      <div className="rental-calendar__nav">
        <button type="button" onClick={prevMonth} className="rental-calendar__arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button type="button" onClick={nextMonth} className="rental-calendar__arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="rental-calendar__months">
        {renderMonth(baseMonth.getFullYear(), baseMonth.getMonth())}
        {renderMonth(month2.getFullYear(), month2.getMonth())}
      </div>
      <div className="rental-calendar__legend">
        <span className="rental-calendar__legend-item">
          <span className="rental-calendar__dot rental-calendar__dot--available" />
          {locale === 'fr' ? 'Disponible' : 'Available'}
        </span>
        <span className="rental-calendar__legend-item">
          <span className="rental-calendar__dot rental-calendar__dot--blocked" />
          {locale === 'fr' ? 'Non disponible' : 'Unavailable'}
        </span>
      </div>
    </div>
  )
}
