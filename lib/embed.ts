/** Pages under a route's /embed path are made to sit in another site's iframe, so the site's own
    nav, footer and painted scene leave them out. */
export const isEmbed = (pathname: string | null) => !!pathname && pathname.endsWith('/embed');
