// Known values in the seeded data. Keep in sync with src/Summit.Web/Data/Seeding/SeedFixtures.cs.
export const seed = {
  conferenceName: 'Summit 2027',
  registeredBadgeCode: 'HTMX4U',
  registeredAttendeeName: 'Avery Quinn',
  checkedInBadgeCode: 'ALPN3S',
  checkedInAttendeeName: 'Jules Moreau',
  validDiscountCode: 'SUMMIT',
  validDiscountPercent: 20,
  expiredDiscountCode: 'WINTER',
  usedUpDiscountCode: 'FRIEND',
  unsafeMarkdownSessionSlug: 'rendering-untrusted-markdown-safely',
  featuredSpeakerSlug: 'amara-okafor',
  soldOutTicketSlug: 'student',
  notOnSaleTicketSlug: 'supporter',
} as const;

// The demo organizer account (appsettings.Testing.json).
export const organizer = {
  email: 'organizer@summit.test',
  password: 'summit-demo-2027',
} as const;
