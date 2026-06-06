/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/credits.html', destination: '/credits', permanent: true },
      { source: '/photography.html', destination: '/photography', permanent: true },
      { source: '/homelab.html', destination: '/homelab', permanent: true },
      { source: '/portfolio.html', destination: '/#portfolio-items-holder', permanent: true },
      { source: '/portfolio', destination: '/#portfolio-items-holder', permanent: true },
      { source: '/Brolocator.html', destination: '/brolocator', permanent: true },
      { source: '/ProjectJune.html', destination: '/project-june', permanent: true },
      { source: '/csdp.html', destination: '/csdp', permanent: true },
      { source: '/pandus.html', destination: '/pandus', permanent: true },
      { source: '/elecf.html', destination: '/elecf', permanent: true },
      { source: '/comingsoon.html', destination: '/comingsoon', permanent: true },
    ];
  },
};

export default nextConfig;
