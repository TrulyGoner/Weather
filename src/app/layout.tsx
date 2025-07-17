import type { Metadata } from 'next';
  import { Inter } from 'next/font/google';
  import './globals.css';
  import ProviderWrapper from '../components/ProviderWrapper';

  const inter = Inter({ subsets: ['latin'] });

  export const metadata: Metadata = {
    title: 'Приложения для прогноза погоды',
    description: 'Прогноз погоды с данными Api Open-Meteo',
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </body>
      </html>
    );
  }