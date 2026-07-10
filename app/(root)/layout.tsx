import Navbar from "@/components/Landing-Page/Navbar";
import Footer from "@/components/Landing-Page/Footer";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="min-h-screen overflow-hidden">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
