import { Poppins } from "next/font/google";
import "./globals.css";
import GlobalDialog from "@/utils/globalDialog";
import { Toaster } from "sonner";
import Providers from "./providers";
import { AuthProvider } from "@/components/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "SIMRS",
  description: "RSU Mitra Paramedika",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="bg-white text-neutral-900 antialiased font-sans">
        <Providers>
          <AuthProvider>
            <main className="relative h-full min-h-screen w-full overflow-x-hidden">
              {children}
            </main>
          </AuthProvider>
          <div className="fixed bottom-2 right-2 text-xs text-gray-500">
             Demo App · Data disimulasikan
          </div>
          <Toaster richColors closeButton position="top-center" />
          <GlobalDialog />
        </Providers>
      </body>
    </html>
  );
}
