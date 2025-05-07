
"use client";
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookMarked, Lightbulb, BookOpenCheck, Users, FileText, Landmark, HelpCircle, Search, Github, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/app/Section';
import type { UsefulLink } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';

// In a real app, this data would come from a CMS, database, or a dedicated data file.
const allMockUsefulLinks: UsefulLink[] = [
  {
    id: "1",
    title: "NotebookLM",
    author: "Google",
    url: "https://notebooklm.google.com/",
    description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
    iconName: "Lightbulb",
    category: "web",
  },
  {
    id: "2",
    title: "OpenStax",
    author: "Rice University",
    url: "https://openstax.org/",
    description: "Access free, peer-reviewed, openly licensed textbooks for college and AP courses.",
    iconName: "BookOpenCheck",
    category: "web",
  },
  {
    id: "3",
    title: "Khan Academy",
    author: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description: "Offers practice exercises, instructional videos, and a personalized learning dashboard.",
    iconName: "Users",
    category: "web",
  },
  {
    id: "4",
    title: "Project Gutenberg",
    author: "Various Volunteers",
    url: "https://www.gutenberg.org/",
    description: "A library of over 70,000 free eBooks, with a focus on older works for which U.S. copyright has expired.",
    iconName: "FileText",
    category: "web",
  },
  {
    id: "5",
    title: "MIT OpenCourseWare",
    author: "MIT",
    url: "https://ocw.mit.edu/",
    description: "A web-based publication of virtually all MIT course content, open and available to the world.",
    iconName: "Landmark",
    category: "web",
  },
  {
    id: "6",
    title: "Next.js Documentation",
    author: "Vercel",
    url: "https://nextjs.org/docs",
    description: "The official documentation for Next.js, a React framework for PWA.",
    iconName: "BookMarked",
    category: "web",
  },
  {
    id: "7",
    title: "Tailwind CSS",
    author: "Tailwind Labs",
    url: "https://tailwindcss.com/docs",
    description: "A utility-first CSS framework for rapid UI development.",
    iconName: "BookMarked",
    category: "web",
  },
  {
    id: "8",
    title: "Shadcn/ui",
    url: "https://ui.shadcn.com/",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    iconName: "BookMarked",
    category: "web",
  },
  {
    id: "9",
    title: "Genkit GitHub Repository",
    author: "Google",
    url: "https://github.com/firebase/genkit",
    description: "The official GitHub repository for Genkit, a toolkit for building AI-powered applications.",
    iconName: "Github",
    category: "repository",
  },
  {
    id: "10",
    title: "Mozilla Developer Network (MDN)",
    author: "Mozilla",
    url: "https://developer.mozilla.org/",
    description: "Comprehensive documentation for web standards and technologies.",
    iconName: "BookOpenCheck",
    category: "web",
  },
  {
    id: "11",
    title: "React Official Website",
    author: "Meta",
    url: "https://react.dev",
    description: "The official website for React, a JavaScript library for building user interfaces.",
    iconName: "BookMarked",
    category: "web",
  },
  {
    id: "12",
    title: "VS Code GitHub Repository",
    author: "Microsoft",
    url: "https://github.com/microsoft/vscode",
    description: "The GitHub repository for Visual Studio Code, a popular open-source code editor.",
    iconName: "Github",
    category: "repository",
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
  Github,
};

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'web', label: 'Web Application / Site' },
  { value: 'repository', label: 'Project Repository' },
];

// export const metadata: Metadata = { // Cannot export metadata from client component
//   title: 'All Useful Links | PersonaLink',
//   description: 'A curated collection of all useful links and resources from PersonaLink.',
// };

export default function UsefulLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredLinks = useMemo(() => {
    return allMockUsefulLinks
      .filter(link => {
        if (selectedCategory === 'all') return true;
        return link.category === selectedCategory;
      })
      .filter(link => {
        const term = searchTerm.toLowerCase();
        return (
          link.title.toLowerCase().includes(term) ||
          (link.author && link.author.toLowerCase().includes(term)) ||
          (link.description && link.description.toLowerCase().includes(term))
        );
      });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <Section title="All Useful Links & Resources" className="w-full">
          <div className="mb-8 p-6 bg-card rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:flex-grow">
                <Input
                  type="text"
                  placeholder="Search by title, author, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[220px] bg-background border-input focus:border-primary">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredLinks.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">No links match your criteria. Try adjusting your search or filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLinks.map((link) => {
                const IconComponent = link.iconName ? (iconMap[link.iconName] || iconMap["BookMarked"]) : iconMap["BookMarked"];
                return (
                  <Card key={link.id} className="flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-6 h-6 mt-1 text-accent flex-shrink-0" />
                        <div className="flex-grow">
                          <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
                          {link.author && <CardDescription>By {link.author}</CardDescription>}
                          {link.category && (
                            <CardDescription className="text-xs mt-1">
                              Category: <span className="font-semibold">{categoryOptions.find(c => c.value === link.category)?.label || link.category}</span>
                            </CardDescription>
                          )}
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
