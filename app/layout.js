import "./globals.css";

export const metadata = {
  title: "Filiz — Türkiye'de E-Ticaret Danışmanın",
  description:
    "Filiz, yapay zeka destekli Türkiye e-ticaret danışmanıdır. Sektör analizi, marka ismi, platform önerisi ve yol haritanızı saniyeler içinde oluşturun.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
