import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const brand = process.env.NEXT_PUBLIC_BRAND || 'Raclettator';
  return {
    name: brand,
    short_name: brand,
    description: 'Organise tes raclettes entre amis',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc', // Tailwind slate-50
    theme_color: '#facc15', // Tailwind yellow-400
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
