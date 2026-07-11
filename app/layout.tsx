import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LuCar Fleet',
  description: 'Plataforma profesional de gestión de flota vehicular con rastreo GPS',
  keywords: ['fleet management', 'GPS tracking', 'vehicle management', 'LuCar'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
