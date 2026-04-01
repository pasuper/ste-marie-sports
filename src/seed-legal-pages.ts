/**
 * Seed the 3 legal/policy pages with generic FR/EN content.
 * Run: npx tsx src/seed-legal-pages.ts
 */

import { getPayload } from '@/lib/payload'

const pages = [
  {
    slug: 'confidentialite',
    template: 'legal',
    isActive: true,
    title: { fr: 'Politique de confidentialité', en: 'Privacy Policy' },
    excerpt: {
      fr: 'Découvrez comment Ste-Marie Sports collecte, utilise et protège vos informations personnelles.',
      en: 'Learn how Ste-Marie Sports collects, uses and protects your personal information.',
    },
    sections: {
      fr: [
        {
          heading: '1. Collecte des informations',
          body: 'Ste-Marie Sports collecte les informations que vous nous fournissez directement, notamment lors de la création d\'un compte, d\'un achat, d\'une demande de contact ou d\'une inscription à notre infolettre. Ces informations peuvent inclure votre nom, adresse courriel, numéro de téléphone, adresse postale et informations de paiement.\n\nNous collectons également automatiquement certaines informations techniques lorsque vous visitez notre site, telles que votre adresse IP, le type de navigateur utilisé et les pages consultées.',
        },
        {
          heading: '2. Utilisation des informations',
          body: 'Vos informations personnelles sont utilisées pour :\n- Traiter et livrer vos commandes\n- Gérer votre compte client\n- Vous envoyer des confirmations de commandes et des mises à jour d\'expédition\n- Répondre à vos demandes de service à la clientèle\n- Vous envoyer des communications marketing si vous y avez consenti\n- Améliorer notre site Web et nos services\n- Respecter nos obligations légales',
        },
        {
          heading: '3. Partage des informations',
          body: 'Nous ne vendons, n\'échangeons ni ne transférons vos informations personnelles à des tiers sans votre consentement, sauf dans les cas suivants :\n- Prestataires de services de confiance qui nous aident à exploiter notre site et à vous servir (traitement des paiements, livraison, hébergement)\n- Obligations légales ou ordonnances judiciaires\n- Protection de nos droits, de notre propriété ou de notre sécurité\n\nTous nos partenaires sont contractuellement tenus de maintenir la confidentialité de vos informations.',
        },
        {
          heading: '4. Cookies et technologies de suivi',
          body: 'Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre appareil. Ils nous permettent de mémoriser vos préférences, d\'analyser le trafic du site et de personnaliser le contenu.\n\nVous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne plus fonctionner correctement.',
        },
        {
          heading: '5. Sécurité des données',
          body: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre tout accès non autorisé, divulgation, altération ou destruction. Les transactions financières sont sécurisées par cryptage SSL.',
        },
        {
          heading: '6. Vos droits',
          body: 'Conformément à la Loi 25 (Loi modernisant des dispositions législatives en matière de protection des renseignements personnels), vous disposez des droits suivants :\n- Accéder à vos informations personnelles\n- Corriger toute information inexacte\n- Demander la suppression de vos informations\n- Retirer votre consentement à tout moment\n\nPour exercer ces droits, contactez-nous à privacy@ste-mariesports.com.',
        },
        {
          heading: '7. Conservation des données',
          body: 'Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services, respecter nos obligations légales, résoudre les litiges et faire respecter nos accords. En général, les données clients actifs sont conservées pendant 7 ans après la dernière transaction.',
        },
        {
          heading: '8. Modifications de cette politique',
          body: 'Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Toute modification importante vous sera notifiée par courriel ou par un avis visible sur notre site. Nous vous encourageons à consulter régulièrement cette page.\n\nDernière mise à jour : Mars 2025',
        },
        {
          heading: '9. Nous contacter',
          body: 'Pour toute question concernant notre politique de confidentialité ou vos informations personnelles, contactez-nous :\n\nSte-Marie Sports\n880 Route du Président-Kennedy, Sainte-Marie, QC G6E 3H5\nTél. : (418) 387-1234\nCourriel : privacy@ste-mariesports.com',
        },
      ],
      en: [
        {
          heading: '1. Information Collection',
          body: 'Ste-Marie Sports collects information you provide directly to us, including when you create an account, make a purchase, submit a contact request, or sign up for our newsletter. This information may include your name, email address, phone number, mailing address, and payment information.\n\nWe also automatically collect certain technical information when you visit our site, such as your IP address, browser type, and pages visited.',
        },
        {
          heading: '2. Use of Information',
          body: 'Your personal information is used to:\n- Process and deliver your orders\n- Manage your customer account\n- Send you order confirmations and shipping updates\n- Respond to your customer service requests\n- Send you marketing communications if you have consented\n- Improve our website and services\n- Comply with our legal obligations',
        },
        {
          heading: '3. Information Sharing',
          body: 'We do not sell, trade, or transfer your personal information to third parties without your consent, except in the following cases:\n- Trusted service providers who help us operate our site and serve you (payment processing, delivery, hosting)\n- Legal obligations or court orders\n- Protection of our rights, property, or safety\n\nAll our partners are contractually required to maintain the confidentiality of your information.',
        },
        {
          heading: '4. Cookies and Tracking Technologies',
          body: 'Our site uses cookies to improve your browsing experience. Cookies are small text files stored on your device. They allow us to remember your preferences, analyze site traffic, and personalize content.\n\nYou can configure your browser to refuse cookies, but some features of the site may no longer function properly.',
        },
        {
          heading: '5. Data Security',
          body: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction. Financial transactions are secured by SSL encryption.',
        },
        {
          heading: '6. Your Rights',
          body: 'You have the right to:\n- Access your personal information\n- Correct any inaccurate information\n- Request deletion of your information\n- Withdraw your consent at any time\n\nTo exercise these rights, contact us at privacy@ste-mariesports.com.',
        },
        {
          heading: '7. Data Retention',
          body: 'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Generally, active customer data is retained for 7 years after the last transaction.',
        },
        {
          heading: '8. Changes to This Policy',
          body: 'We may update this privacy policy periodically. Any significant changes will be notified to you by email or by a visible notice on our site. We encourage you to review this page regularly.\n\nLast updated: March 2025',
        },
        {
          heading: '9. Contact Us',
          body: 'For any questions regarding our privacy policy or your personal information, contact us:\n\nSte-Marie Sports\n880 Route du Président-Kennedy, Sainte-Marie, QC G6E 3H5\nPhone: (418) 387-1234\nEmail: privacy@ste-mariesports.com',
        },
      ],
    },
  },
  {
    slug: 'conditions',
    template: 'legal',
    isActive: true,
    title: { fr: "Conditions d'utilisation", en: 'Terms of Use' },
    excerpt: {
      fr: "Les présentes conditions régissent votre utilisation du site Web et des services de Ste-Marie Sports.",
      en: 'These terms govern your use of the Ste-Marie Sports website and services.',
    },
    sections: {
      fr: [
        {
          heading: '1. Acceptation des conditions',
          body: 'En accédant et en utilisant le site Web de Ste-Marie Sports (ste-mariesports.com), vous acceptez d\'être lié par les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre site.\n\nNous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur le site.',
        },
        {
          heading: '2. Utilisation du site',
          body: 'Vous vous engagez à utiliser ce site uniquement à des fins légales et de manière à ne pas porter atteinte aux droits d\'autrui. Il est interdit de :\n- Utiliser le site de manière frauduleuse ou à des fins illégales\n- Tenter d\'obtenir un accès non autorisé à nos systèmes\n- Transmettre des virus ou tout autre code malveillant\n- Collecter des informations sur d\'autres utilisateurs sans leur consentement\n- Reproduire, dupliquer ou copier le contenu du site à des fins commerciales sans autorisation',
        },
        {
          heading: '3. Comptes clients',
          body: 'Pour effectuer des achats, vous devrez créer un compte client. Vous êtes responsable de maintenir la confidentialité de votre mot de passe et de toutes les activités effectuées depuis votre compte. Veuillez nous informer immédiatement de toute utilisation non autorisée de votre compte.\n\nNous nous réservons le droit de résilier votre compte si vous violez les présentes conditions.',
        },
        {
          heading: '4. Produits et disponibilité',
          body: 'Les prix et la disponibilité des produits sont sujets à changement sans préavis. Nous faisons tout notre possible pour maintenir les informations à jour, mais des erreurs peuvent survenir. Nous nous réservons le droit d\'annuler ou de refuser toute commande en cas d\'erreur de prix ou de disponibilité.\n\nLes images des produits sont à titre indicatif. Les produits réels peuvent légèrement différer des images présentées.',
        },
        {
          heading: '5. Prix et paiement',
          body: 'Tous les prix sont en dollars canadiens (CAD) et incluent les taxes applicables, sauf indication contraire. Nous acceptons les paiements par Visa, Mastercard, American Express et Interac.\n\nLe paiement est exigé au moment de la commande. Votre commande ne sera traitée qu\'une fois le paiement confirmé.',
        },
        {
          heading: '6. Livraison',
          body: 'Nous livrons partout au Canada. Les délais et frais de livraison varient selon la destination et le poids de la commande. La livraison gratuite est offerte sur les commandes de 99 $ et plus.\n\nNous ne sommes pas responsables des délais causés par les transporteurs ou des circonstances hors de notre contrôle.',
        },
        {
          heading: '7. Propriété intellectuelle',
          body: 'Tout le contenu de ce site (textes, images, logos, graphiques, vidéos) est la propriété de Ste-Marie Sports ou de ses fournisseurs et est protégé par les lois sur la propriété intellectuelle. Toute reproduction non autorisée est interdite.',
        },
        {
          heading: '8. Limitation de responsabilité',
          body: 'Dans toute la mesure permise par la loi applicable, Ste-Marie Sports ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de l\'utilisation ou de l\'impossibilité d\'utiliser notre site ou nos produits.\n\nNotre responsabilité totale envers vous pour toute réclamation ne dépassera pas le montant payé pour la commande concernée.',
        },
        {
          heading: '9. Droit applicable',
          body: 'Les présentes conditions sont régies par les lois de la province de Québec et les lois fédérales canadiennes applicables. Tout litige sera soumis à la compétence exclusive des tribunaux du Québec.',
        },
        {
          heading: '10. Contact',
          body: 'Pour toute question concernant ces conditions d\'utilisation :\n\nSte-Marie Sports\n880 Route du Président-Kennedy, Sainte-Marie, QC G6E 3H5\nTél. : (418) 387-1234\nCourriel : info@ste-mariesports.com',
        },
      ],
      en: [
        {
          heading: '1. Acceptance of Terms',
          body: 'By accessing and using the Ste-Marie Sports website (ste-mariesports.com), you agree to be bound by these Terms of Use. If you do not accept these terms, please do not use our site.\n\nWe reserve the right to modify these terms at any time. Modifications take effect upon publication on the site.',
        },
        {
          heading: '2. Use of the Site',
          body: 'You agree to use this site only for lawful purposes and in a manner that does not infringe the rights of others. It is prohibited to:\n- Use the site fraudulently or for illegal purposes\n- Attempt to gain unauthorized access to our systems\n- Transmit viruses or any other malicious code\n- Collect information about other users without their consent\n- Reproduce, duplicate, or copy site content for commercial purposes without authorization',
        },
        {
          heading: '3. Customer Accounts',
          body: 'To make purchases, you will need to create a customer account. You are responsible for maintaining the confidentiality of your password and all activities conducted from your account. Please notify us immediately of any unauthorized use of your account.\n\nWe reserve the right to terminate your account if you violate these terms.',
        },
        {
          heading: '4. Products and Availability',
          body: 'Prices and product availability are subject to change without notice. We do our best to keep information up to date, but errors may occur. We reserve the right to cancel or refuse any order in case of price or availability errors.\n\nProduct images are for illustrative purposes only. Actual products may slightly differ from the images shown.',
        },
        {
          heading: '5. Pricing and Payment',
          body: 'All prices are in Canadian dollars (CAD) and include applicable taxes unless otherwise indicated. We accept payments by Visa, Mastercard, American Express, and Interac.\n\nPayment is required at the time of order. Your order will only be processed once payment is confirmed.',
        },
        {
          heading: '6. Shipping',
          body: 'We ship anywhere in Canada. Delivery times and costs vary by destination and order weight. Free shipping is offered on orders of $99 and over.\n\nWe are not responsible for delays caused by carriers or circumstances beyond our control.',
        },
        {
          heading: '7. Intellectual Property',
          body: 'All content on this site (text, images, logos, graphics, videos) is the property of Ste-Marie Sports or its suppliers and is protected by intellectual property laws. Any unauthorized reproduction is prohibited.',
        },
        {
          heading: '8. Limitation of Liability',
          body: 'To the fullest extent permitted by applicable law, Ste-Marie Sports will not be liable for indirect, incidental, or consequential damages resulting from the use or inability to use our site or products.\n\nOur total liability to you for any claim shall not exceed the amount paid for the relevant order.',
        },
        {
          heading: '9. Governing Law',
          body: 'These terms are governed by the laws of the province of Quebec and applicable Canadian federal laws. Any dispute shall be subject to the exclusive jurisdiction of Quebec courts.',
        },
        {
          heading: '10. Contact',
          body: 'For any questions regarding these Terms of Use:\n\nSte-Marie Sports\n880 Route du Président-Kennedy, Sainte-Marie, QC G6E 3H5\nPhone: (418) 387-1234\nEmail: info@ste-mariesports.com',
        },
      ],
    },
  },
  {
    slug: 'politique-retour',
    template: 'legal',
    isActive: true,
    title: { fr: 'Politique de retour', en: 'Return Policy' },
    excerpt: {
      fr: 'Satisfait ou remboursé — découvrez nos conditions de retour et d\'échange simples.',
      en: 'Satisfaction guaranteed — learn about our simple return and exchange conditions.',
    },
    sections: {
      fr: [
        {
          heading: 'Notre engagement',
          body: 'Chez Ste-Marie Sports, votre satisfaction est notre priorité. Si vous n\'êtes pas entièrement satisfait de votre achat, nous vous offrons la possibilité de retourner la plupart des articles dans les 30 jours suivant la réception.',
        },
        {
          heading: 'Délai de retour',
          body: 'Vous disposez de 30 jours calendaires à compter de la date de réception de votre commande pour nous retourner un article. Passé ce délai, nous ne pouvons malheureusement pas accepter de retour.',
        },
        {
          heading: 'Conditions de retour',
          body: 'Pour être accepté en retour, l\'article doit :\n- Être dans son état d\'origine, non porté et non utilisé\n- Conserver toutes ses étiquettes et être dans son emballage d\'origine\n- Ne pas avoir été modifié ou endommagé\n- Être accompagné de la facture ou du bon de commande original\n\nLes articles en solde peuvent être soumis à des conditions différentes. Veuillez vérifier lors de l\'achat.',
        },
        {
          heading: 'Articles non retournables',
          body: 'Les articles suivants ne peuvent pas être retournés :\n- Articles portés, utilisés ou endommagés par le client\n- Produits chimiques, lubrifiants et fluides une fois ouverts\n- Vêtements sous-vêtements et protections intimes pour des raisons d\'hygiène\n- Articles personnalisés ou faits sur mesure\n- Téléchargements numériques et licences logicielles\n- Articles clairement identifiés comme non retournables',
        },
        {
          heading: 'Procédure de retour',
          body: 'Pour initier un retour :\n1. Contactez notre service à la clientèle au (418) 387-1234 ou à retours@ste-mariesports.com\n2. Obtenez un numéro d\'autorisation de retour (NAR)\n3. Emballez soigneusement l\'article avec le NAR clairement indiqué sur le colis\n4. Envoyez le colis à notre adresse (les frais de retour sont à la charge du client, sauf en cas d\'erreur de notre part ou d\'article défectueux)',
        },
        {
          heading: 'Remboursements',
          body: 'Une fois votre retour reçu et inspecté, vous serez informé par courriel de l\'approbation ou du refus du remboursement.\n\nSi approuvé, le remboursement sera effectué sur votre mode de paiement original dans un délai de 5 à 10 jours ouvrables. Notez que votre institution financière peut prendre quelques jours supplémentaires pour traiter le crédit.',
        },
        {
          heading: 'Échanges',
          body: 'Si vous souhaitez échanger un article pour une taille ou une couleur différente, contactez-nous avant de retourner l\'article. Les échanges sont traités comme un retour suivi d\'un nouvel achat.\n\nSi l\'article de remplacement est plus cher, vous devrez payer la différence. S\'il est moins cher, nous vous rembourserons la différence.',
        },
        {
          heading: 'Articles défectueux ou incorrects',
          body: 'Si vous avez reçu un article défectueux ou un article différent de celui commandé, contactez-nous immédiatement. Nous prendrons en charge les frais de retour et vous enverrons le bon article ou vous rembourserons intégralement, selon votre préférence.',
        },
        {
          heading: 'Pièces et accessoires techniques',
          body: 'Pour les pièces mécaniques et accessoires techniques, assurez-vous de vérifier la compatibilité avec votre véhicule avant l\'installation. Nous recommandons de faire installer les pièces par un technicien qualifié. Les pièces installées incorrectement ou modifiées ne peuvent pas être retournées.',
        },
        {
          heading: 'Contact',
          body: 'Service à la clientèle — Retours\nSte-Marie Sports\n880 Route du Président-Kennedy, Sainte-Marie, QC G6E 3H5\nTél. : (418) 387-1234\nCourriel : retours@ste-mariesports.com\nHeures d\'ouverture : Lun–Ven 8h30–17h30',
        },
      ],
      en: [
        {
          heading: 'Our Commitment',
          body: 'At Ste-Marie Sports, your satisfaction is our priority. If you are not entirely satisfied with your purchase, we offer the possibility of returning most items within 30 days of receipt.',
        },
        {
          heading: 'Return Period',
          body: 'You have 30 calendar days from the date of receipt of your order to return an item to us. After this period, unfortunately we cannot accept returns.',
        },
        {
          heading: 'Return Conditions',
          body: 'To be accepted for return, the item must:\n- Be in its original condition, unworn and unused\n- Retain all tags and be in its original packaging\n- Not have been modified or damaged\n- Be accompanied by the original invoice or order confirmation\n\nSale items may be subject to different conditions. Please verify at the time of purchase.',
        },
        {
          heading: 'Non-Returnable Items',
          body: 'The following items cannot be returned:\n- Items worn, used, or damaged by the customer\n- Chemical products, lubricants, and fluids once opened\n- Underwear and intimate protective gear for hygiene reasons\n- Personalized or custom-made items\n- Digital downloads and software licenses\n- Items clearly identified as non-returnable',
        },
        {
          heading: 'Return Process',
          body: 'To initiate a return:\n1. Contact our customer service at (418) 387-1234 or returns@ste-mariesports.com\n2. Obtain a Return Authorization Number (RAN)\n3. Carefully package the item with the RAN clearly marked on the package\n4. Send the package to our address (return shipping costs are the customer\'s responsibility, except in case of our error or a defective item)',
        },
        {
          heading: 'Refunds',
          body: 'Once your return is received and inspected, you will be notified by email of the approval or rejection of the refund.\n\nIf approved, the refund will be processed to your original payment method within 5 to 10 business days. Note that your financial institution may take a few additional days to process the credit.',
        },
        {
          heading: 'Exchanges',
          body: 'If you wish to exchange an item for a different size or color, contact us before returning the item. Exchanges are processed as a return followed by a new purchase.\n\nIf the replacement item is more expensive, you will need to pay the difference. If it is less expensive, we will refund the difference.',
        },
        {
          heading: 'Defective or Incorrect Items',
          body: 'If you received a defective item or an item different from what you ordered, contact us immediately. We will cover return shipping costs and send you the correct item or issue a full refund, depending on your preference.',
        },
        {
          heading: 'Technical Parts and Accessories',
          body: 'For mechanical parts and technical accessories, make sure to verify compatibility with your vehicle before installation. We recommend having parts installed by a qualified technician. Incorrectly installed or modified parts cannot be returned.',
        },
        {
          heading: 'Contact',
          body: 'Customer Service — Returns\nSte-Marie Sports\n880 Route du Président-Kennedy, Sainte-Marie, QC G6E 3H5\nPhone: (418) 387-1234\nEmail: returns@ste-mariesports.com\nBusiness hours: Mon–Fri 8:30am–5:30pm',
        },
      ],
    },
  },
]

async function seed() {
  const payload = await getPayload()

  for (const page of pages) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1 })

    const data = {
      title: page.title.fr,
      slug: page.slug,
      template: page.template as any,
      isActive: page.isActive,
      excerpt: page.excerpt.fr,
      sections: page.sections.fr,
    }

    if (existing.docs.length > 0) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data, locale: 'fr' })
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data: { title: page.title.en, excerpt: page.excerpt.en, sections: page.sections.en }, locale: 'en' })
      console.log(`Updated: ${page.slug}`)
    } else {
      const created = await payload.create({ collection: 'pages', data, locale: 'fr' })
      await payload.update({ collection: 'pages', id: created.id, data: { title: page.title.en, excerpt: page.excerpt.en, sections: page.sections.en }, locale: 'en' })
      console.log(`Created: ${page.slug}`)
    }
  }

  console.log('\nLegal pages seeded successfully!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
