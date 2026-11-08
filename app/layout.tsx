import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FORMA — Воображай. Мы создадим.',
  description: 'Персонализированные предметы нового поколения. Обсуди идею с AI, согласуй дизайн и закажи изготовление.',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}