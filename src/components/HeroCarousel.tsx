'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/media'

interface HeroSlide {
  id?: number
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  backgroundImage: any
  overlayOpacity?: number
  textAlignment?: 'left' | 'center' | 'right'
}

interface HeroCarouselProps {
  heroSection: any
  locale: string
  lightElementUrl?: string
  className?: string
}

const HeroCarousel = ({ heroSection, locale, lightElementUrl, className = '' }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slides: HeroSlide[] = heroSection?.slides || []
  const slideCount = slides.length

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide((index + slideCount) % slideCount)
  }, [slideCount])

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1)
  }, [currentSlide, goToSlide])

  useEffect(() => {
    if (!heroSection?.autoPlay || isPaused || slideCount <= 1) return
    const interval = setInterval(() => {
      nextSlide()
    }, heroSection.autoPlayDelay || 5000)
    return () => clearInterval(interval)
  }, [heroSection?.autoPlay, heroSection?.autoPlayDelay, isPaused, nextSlide, slideCount])

  if (slideCount === 0) return null

  const renderSlide = (slide: HeroSlide, index: number) => {
    const isActive = index === currentSlide
    const bgUrl = slide.backgroundImage ? getMediaUrl(slide.backgroundImage.url || slide.backgroundImage) : ''
    const overlayOpacity = (slide.overlayOpacity ?? 50) / 100

    return (
      <div
        key={slide.id || index}
        className={`hero-slide ${isActive ? 'hero-slide--active' : ''}`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="hero-slide__overlay" style={{ opacity: overlayOpacity }} />
        {lightElementUrl && (
          <img src={lightElementUrl} alt="" className="hero-slide__light-element" />
        )}
        <div className={`hero-slide__content hero-slide__content--${slide.textAlignment || 'left'}`}>
          <div className="container">
            <h1 className="hero-slide__title">{slide.title}</h1>
            {slide.subtitle && <p className="hero-slide__subtitle">{slide.subtitle}</p>}
            {slide.buttonText && slide.buttonLink && (
              <Link href={slide.buttonLink.startsWith('/') ? `/${locale}${slide.buttonLink}` : slide.buttonLink} className="hero-slide__cta">
                {slide.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      className={`hero-carousel ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-carousel__slides">
        {slides.map((slide, index) => renderSlide(slide, index))}
      </div>

      {slideCount > 1 && (
        <>
          <button className="hero-carousel__arrow hero-carousel__arrow--prev" onClick={prevSlide} aria-label="Slide précédente">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="hero-carousel__arrow hero-carousel__arrow--next" onClick={nextSlide} aria-label="Slide suivante">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      {slideCount > 1 && (
        <div className="hero-carousel__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-carousel__dot ${index === currentSlide ? 'hero-carousel__dot--active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroCarousel
