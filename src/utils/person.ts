// Strukturierte Daten (schema.org) zur Person hinter der Website.
// Wird auf der Startseite ausgegeben und von Artikeln als Autor referenziert.
export const personId = 'https://raphaelfredebeul.de/#person';

export function personSchema(site: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: 'Raphael Fredebeul',
    url: new URL('/', site).toString(),
    image: new URL('/images/raphael-portrait.jpeg', site).toString(),
    jobTitle: 'Data Scientist',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bielefeld',
      addressCountry: 'DE',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universität Bielefeld',
    },
    knowsAbout: [
      'Künstliche Intelligenz',
      'Data Science',
      'Datenanalyse',
      'KI-Use-Cases',
      'AI Adoption',
      'Innovation',
    ],
    sameAs: [
      'https://www.linkedin.com/in/raphael-fredebeul-733605140/',
      'https://www.kaggle.com/raphaelfredebeul',
      'https://soundcloud.com/raphael-fredebeul',
    ],
  };
}
