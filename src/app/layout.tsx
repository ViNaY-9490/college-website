import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import ChatbotWidget from '@/components/ui/ChatbotWidget';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#07080b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ecellvitb.in'),
  title: {
    default: 'E-Cell VITB | Entrepreneurship Cell of Vishnu Institute of Technology',
    template: '%s | E-Cell VITB',
  },
  description:
    'Student-driven entrepreneurship community at Vishnu Institute of Technology. Innovate – Create – Lead. Transform your ideas into successful startups through mentorship, hackathons, and venture capital linkages.',
  keywords: [
    'E-Cell VITB',
    'Entrepreneurship Cell',
    'Vishnu Institute of Technology',
    'Bhimavaram',
    'Startup Incubator',
    'Student Startups',
    'Hackathon',
    'E-Summit 2026',
    'Innovate Create Lead',
  ],
  authors: [{ name: 'E-Cell VITB', url: 'https://ecellvitb.in' }],
  creator: 'E-Cell VITB',
  publisher: 'Vishnu Institute of Technology',
  icons: {
    icon: '/brand/ecell-logo.png',
    shortcut: '/brand/ecell-logo.png',
    apple: '/brand/ecell-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ecellvitb.in',
    siteName: 'E-Cell VITB',
    title: 'E-Cell VITB | Entrepreneurship Cell of Vishnu Institute of Technology',
    description:
      'Student-driven entrepreneurship community at Vishnu Institute of Technology. Transform your ideas into successful startups.',
    images: [
      {
        url: '/brand/ecell-logo.png',
        width: 800,
        height: 800,
        alt: 'E-Cell VITB Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Cell VITB | Entrepreneurship Cell of Vishnu Institute of Technology',
    description:
      'Student-driven entrepreneurship community at Vishnu Institute of Technology. Innovate – Create – Lead.',
    images: ['/brand/ecell-logo.png'],
    creator: '@ecell_vitb',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'E-Cell VITB',
    alternateName: 'Entrepreneurship Cell of Vishnu Institute of Technology',
    url: 'https://ecellvitb.in',
    logo: 'https://ecellvitb.in/brand/ecell-logo.png',
    description:
      'Student-driven entrepreneurship community at Vishnu Institute of Technology that promotes entrepreneurship, hackathons, and startup incubation.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vishnu Institute of Technology, Vishnupur',
      addressLocality: 'Bhimavaram',
      addressRegion: 'Andhra Pradesh',
      postalCode: '534202',
      addressCountry: 'IN',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Vishnu Institute of Technology',
      url: 'https://vishnu.edu.in',
    },
    slogan: 'INNOVATE – CREATE – LEAD',
  };

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-[#07080b] text-[#f8fafc] min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
        <CustomCursor />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
