import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ProviderWrapper from '../components/ProviderWrapper';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Прогноз погоды',
  description: 'Прогноз погоды для выбранного города с использованием API Open-Meteo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}