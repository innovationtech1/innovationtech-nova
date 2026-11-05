// El panel no debe aparecer en Google
export const metadata = {
  title: "Panel de NOVA | InnovationTECH",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
