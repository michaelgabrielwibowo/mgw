import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookMarked, Lightbulb, BookOpenCheck, Users, FileText, Landmark, HelpCircle, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/app/Section';
import type { UsefulLink } from '@/types';

export const metadata: Metadata = {
  title: 'All Useful Links | PersonaLink',
  description: 'A curated collection of all useful links and resources from PersonaLink.',
};

// In a real app, this data would come from a CMS, database, or a dedicated data file.
// Copied from src/app/page.tsx for current implementation.
const mockUsefulLinks: UsefulLink[] = [
  {
    id: "1",
    title: "NotebookLM",
    author: "Google",
    url: "https://notebooklm.google.com/",
    description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
    iconName: "Lightbulb",
  },
  {
    id: "2",
    title: "OpenStax",
    author: "Rice University",
    url: "https://openstax.org/",
    description: "Access free, peer-reviewed, openly licensed textbooks for college and AP courses.",
    iconName: "BookOpenCheck",
  },
  {
    id: "3",
    title: "Khan Academy",
    author: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description: "Offers practice exercises, instructional videos, and a personalized learning dashboard.",
    iconName: "Users",
  },
  {
    id: "4",
    title: "Project Gutenberg",
    author: "Various Volunteers",
    url: "https://www.gutenberg.org/",
    description: "A library of over 70,000 free eBooks, with a focus on older works for which U.S. copyright has expired.",
    iconName: "FileText",
  },
  {
    id: "5",
    title: "MIT OpenCourseWare",
    author: "MIT",
    url: "https://ocw.mit.edu/",
    description: "A web-based publication of virtually all MIT course content, open and available to the world.",
    iconName: "Landmark",
  },
  {
    id: "6",
    title: "Next.js Documentation",
    author: "Vercel",
    url: "https://nextjs.org/docs",
    description: "The official documentation for Next.js, a React framework for PWA.",
    iconName: "BookMarked"
  },
  {
    id: "7",
    title: "Tailwind CSS",
    author: "Tailwind Labs",
    url: "https://tailwindcss.com/docs",
    description: "A utility-first CSS framework for rapid UI development.",
    iconName: "BookMarked"
  },
  {
    id: "8",
    title: "Shadcn/ui",
    url: "https://ui.shadcn.com/",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    iconName: "BookMarked"
  },
];

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  BookOpenCheck,
  Users,
  FileText,
  Landmark,
  BookMarked,
  HelpCircle,
};

export default function UsefulLinksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Section title="All Useful Links & Resources" className="w-full">
          {mockUsefulLinks.length === 0 ? (
            <p className="text-muted-foreground text-center">No links available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockUsefulLinks.map((link) => {
                const IconComponent = link.iconName ? (iconMap[link.iconName] || iconMap["BookMarked"]) : iconMap["BookMarked"];
                return (
                  <Card key={link.id} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-300 ease-in-out">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-6 h-6 mt-1 text-accent flex-shrink-0" />
                        <div className="flex-grow">
                          <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
                          {link.author && <CardDescription>By {link.author}</CardDescription>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pl-[calc(1.5rem+1.5rem+0.75rem)] pr-6 pb-6 pt-0">
                      {link.description ? (
                        <p className="text-sm text-card-foreground">{link.description}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No description provided.</p>
                      )}
                    </CardContent>
                    <CardFooter className="pl-[calc(1.5rem+1.5rem+0.75rem)] pr-6 pb-6">
                      <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                        <Link href={link.url} target="_blank" rel="noopener noreferrer">
                          Visit Link <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </Section>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved. {/* TODO: User to update */}</p>
        <p className="mt-1">Explore more useful links and continue learning.</p>
      </footer>
    </div>
  );
}
