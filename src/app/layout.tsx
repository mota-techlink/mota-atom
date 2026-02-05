import { BionicProvider } from "@/components/providers/bionic-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BionicProvider> {/* 👈 包裹在这里 */}
          {children}
        </BionicProvider>
      </body>
    </html>
  );
}