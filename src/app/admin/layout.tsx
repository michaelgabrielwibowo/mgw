import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/app/ThemeToggle'; // Import ThemeToggle

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Admin Panel</h1>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Site
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p>PersonaLink Admin Interface</p>
            <div className="mt-2 sm:mt-0">
               <ThemeToggle />
            </div>
        </div>
      </footer>
    </div>
  );
}
