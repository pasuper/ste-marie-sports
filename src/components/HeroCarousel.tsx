'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/media'

interface HeroSlide {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage: any
  overlayOpacity?: number
  textAlignment?: 'left' | 'center' | 'right'
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlay?: boolean
  autoPlayDelay?: number
  locale: string
}

export default function HeroCarousel({ slides, autoPlay = true, autoPlayDelay = 5000, locale }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const timer = setInterval(nextSlide, autoPlayDelay)
    return () => clearInterval(timer)
  }, [autoPlay, autoPlayDelay, nextSlide, slides.length])

  if (!slides || slides.length === 0) return null

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => {
        const bgUrl = getMediaUrl(slide.backgroundImage)
        return (
          <div key={index} className={`hero-carousel__slide ${index === currentSlide ? 'hero-carousel__slide--active' : ''}`}>
            <Image src={bgUrl} alt={slide.title || ''} fill className="hero-carousel__bg" priority={index === 0} />
            <div className="hero-carousel__overlay" style={{ opacity: (slide.overlayOpacity || 30) / 100 }} />
            <div className={`hero-carousel__content hero-carousel__content--${slide.textAlignment || 'left'}`}>
              {slide.title && <h1 className="hero-carousel__title">{slide.title}</h1>}
              {slide.subtitle && <p className="hero-carousel__subtitle">{slide.subtitle}</p>}
              {slide.buttonText && slide.buttonLink && (
                <Link href={slide.buttonLink.startsWith('/') ? `/${locale}${slide.buttonLink}` : slide.buttonLink} className="hero-carousel__cta">
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        )
      })}
      {slides.length > 1 && (
        <>
          <button className="hero-carousel__prev" onClick={prevSlide}>&lsaquo;</button>
          <button className="hero-carousel__next" onClick={nextSlide}>&rsaquo;</button>
          <div className="hero-carousel__dots">
            {slides.map((_, i) => (
              <button key={i} className={`hero-carousel__dot ${i === currentSlide ? 'hero-carousel__dot--active' : ''}`} onClick={() => setCurrentSlide(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
