import type { GlobalConfig } from 'payload'

export const CheckoutSettings: GlobalConfig = {
  slug: 'checkout-settings',
  admin: { group: 'Settings' },
  fields: [
    { name: 'guestCheckoutEnabled', type: 'checkbox', defaultValue: true },
    { name: 'minimumOrderAmount', type: 'number', defaultValue: 0 },
    {
      name: 'paymentMethods',
      type: 'group',
      fields: [
        { name: 'stripeEnabled', type: 'checkbox', defaultValue: true },
        { name: 'paypalEnabled', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'checkoutLabels',
      type: 'group',
      localized: true,
      fields: [
        { name: 'stepShippingTitle', type: 'text', defaultValue: 'Livraison' },
        { name: 'stepPaymentTitle', type: 'text', defaultValue: 'Paiement' },
        { name: 'stepConfirmTitle', type: 'text', defaultValue: 'Confirmation' },
        { name: 'orderSummaryTitle', type: 'text', defaultValue: 'R\u00e9sum\u00e9 de la commande' },
        { name: 'placeOrderButton', type: 'text', defaultValue: 'Passer la commande' },
        { name: 'subtotalLabel', type: 'text', defaultValue: 'Sous-total' },
        { name: 'shippingLabel', type: 'text', defaultValue: 'Livraison' },
        { name: 'taxLabel', type: 'text', defaultValue: 'Taxes' },
        { name: 'totalLabel', type: 'text', defaultValue: 'Total' },
        { name: 'freeShippingMessage', type: 'text', defaultValue: 'Livraison gratuite' },
      ],
    },
    { name: 'termsPage', type: 'relationship', relationTo: 'pages' },
    { name: 'privacyPage', type: 'relationship', relationTo: 'pages' },
    { name: 'successMessage', type: 'richText', localized: true },
  ],
}
