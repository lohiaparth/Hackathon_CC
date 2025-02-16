import Link from "next/link";
import "./globals.css"; // Ensure you import global styles if needed

export const metadata = {
  title: "Startup Helper",
  description: "AI-powered fundraising and legal compliance assistance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-blue-800 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/product-info" className="text-2xl font-bold">
              Founder Friend 🚀
            </Link>

            <div className="space-x-6">
            <Link href="/cofounder-find" className="hover:underline">
                Find a Cofounder
              </Link>
            <Link href="/data-validation" className="hover:underline">
                Validate Your Idea
              </Link>
              <Link href="/ideation" className="hover:underline">
                New Product Ideas
              </Link>
              <Link href="/fundraising" className="hover:underline">
                Fundraising Plan
              </Link>
              <Link href="/legalities" className="hover:underline">
                Generate Legal Compliance
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
