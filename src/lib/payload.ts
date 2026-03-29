import { getPayload as getPayloadClient } from 'payload'
import config from '@payload-config'

export const getPayload = () => getPayloadClient({ config })

export type SiteLocale = 'fr' | 'en'

export function asLocale(locale: string): SiteLocale {
  return (locale === 'en' ? 'en' : 'fr') as SiteLocale
}
