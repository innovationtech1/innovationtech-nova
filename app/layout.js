import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fuenteTexto = Inter({
  subsets: ["latin"],
  variable: "--fuente-texto",
});

const fuenteTitulos = Space_Grotesk({
  subsets: ["latin"],
  variable: "--fuente-titulos",
});

export const metadata = {
  title: "InnovationTECH | Agencia de servicios digitales en San Antonio, TX",
  description:
    "Marketing digital, creación de contenido, edición de video, logos e identidad de marca y desarrollo web en San Antonio, TX.",
};

export const viewport = {
  themeColor: "#050b1f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${fuenteTexto.variable} ${fuenteTitulos.variable}`}>
      <body>{children}</body>
    </html>
  );
}
