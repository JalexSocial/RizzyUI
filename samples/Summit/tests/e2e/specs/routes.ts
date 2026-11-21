// Every page in Summit. axe.spec.ts scans each one; Summit.Tests checks that every controller route
// is listed here, so a new page cannot ship without an accessibility scan.
export type RouteEntry = { path: string; heading: string | RegExp; organizer?: boolean };

export const publicRoutes: RouteEntry[] = [
  { path: '/', heading: /Summit/ },
  { path: '/schedule', heading: 'Schedule' },
  { path: '/speakers', heading: 'Speakers' },
  { path: '/tickets', heading: 'Tickets' },
  { path: '/help', heading: 'Help & FAQ' },
  { path: '/account/sign-in', heading: 'Organizer sign-in' },
  { path: '/does-not-exist', heading: 'Page not found' },
];

export const organizerRoutes: RouteEntry[] = [
  { path: '/organizer', heading: 'Dashboard', organizer: true },
  { path: '/organizer/attendees', heading: 'Attendees', organizer: true },
  { path: '/organizer/check-in', heading: 'Check-in desk', organizer: true },
  { path: '/organizer/schedule-builder', heading: 'Schedule builder', organizer: true },
  { path: '/organizer/settings', heading: 'Settings', organizer: true },
];
