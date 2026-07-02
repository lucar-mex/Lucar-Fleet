import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LuCar Fleet - Sprint 2',
  description: 'Sistema de gestión de flota vehicular multi-empresa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
