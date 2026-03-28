import fr from '@/translations/fr.json'
import en from '@/translations/en.json'

type Locale = 'fr' | 'en'

const translations: Record<Locale, Record<string, any>> = { fr, en }

export function t(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: any = translations[locale]
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  return typeof value === 'string' ? value : key
}

export const locales = ['fr', 'en'] as const
export const defaultLocale = 'fr' as const
export type { Locale }
