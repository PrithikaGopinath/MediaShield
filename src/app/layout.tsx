import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MediaShield",
  description: "Identity-verified deepfake detection",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


