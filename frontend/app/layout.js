import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});



export const metadata = {
  title: 'EduAI – AI-Powered E-Learning Platform',
  description: 'Generate AI-powered notes, summaries, and quizzes from your PDF documents.',
  keywords: 'e-learning, AI, quiz, education, notes, summary',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: 'var(--shadow-md)',
              },
              success: { iconTheme: { primary: 'var(--success)', secondary: 'white' } },
              error: { iconTheme: { primary: 'var(--error)', secondary: 'white' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
