import '../styles/globals.css';

export const metadata = {
  title: 'Transblindados - Segurança em Locação',
  description: 'Locação de veículos blindados com IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}
