
"use client";
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookMarked, Lightbulb, BookOpenCheck, Users, FileText, Landmark, HelpCircle, Search, Github, Code, School, Award, Video, ListVideo, BookOpen, Cpu, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/app/Section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { usefulLinksData, siteProfileData } from '@/data/site-data'; 
import type { UsefulLink } from '@/types'; 
import { suggestUsefulLinks, type SuggestUsefulLinksInput } from '@/ai/flows/suggest-useful-links-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  BookOpenCheck,
  Users,
  FileText,
  Landmark,
  BookMarked,
  HelpCircle,
  Github,
  Code,
  School,
  Award,
  Video,
  ListVideo,
  BookOpen,
  Cpu, // Added Cpu icon
};

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'learning', label: 'Learning & Education' },
  { value: 'web', label: 'Websites & Tools' },
  { value: 'project_repository', label: 'Project Repositories' },
  { value: 'book', label: 'Books' },
  { value: 'youtube', label: 'YouTube Content' },
];

export default function UsefulLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [links, setLinks] = useState<UsefulLink[]>(usefulLinksData);
  const [isLoadingNewLinks, setIsLoadingNewLinks] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    setCurrentTime(new Date().getFullYear().toString());
  }, []);


  const filteredLinks = useMemo(() => {
    return links
      .filter(link => {
        if (selectedCategory === 'all') return true;
        // Ensure consistent category naming (e.g. project_repository vs repository)
        const linkCategory = link.category === 'repository' ? 'project_repository' : link.category;
        return linkCategory === selectedCategory;
      })
      .filter(link => {
        const term = searchTerm.toLowerCase();
        return (
          link.title.toLowerCase().includes(term) ||
          (link.author && link.author.toLowerCase().includes(term)) ||
          (link.description && link.description.toLowerCase().includes(term))
        );
      });
  }, [searchTerm, selectedCategory, links]);

  const handleSuggestNewLinks = async () => {
    setIsLoadingNewLinks(true);
    try {
      const input: SuggestUsefulLinksInput = {
        existingLinks: links.map(l => ({ title: l.title, url: l.url })),
      };
      const result = await suggestUsefulLinks(input);
      
      if (result && result.suggestedLinks) {
        const newLinksToAdd: UsefulLink[] = result.suggestedLinks.map((sl, index) => ({
          id: `suggested-${Date.now()}-${index}`, // Generate a unique ID
          title: sl.title,
          author: sl.author,
          url: sl.url,
          description: sl.description,
          iconName: mapKeywordsToIcon(sl.iconKeywords) || 'HelpCircle',
          category: sl.category,
        }));

        // Filter out duplicates based on URL before adding
        const uniqueNewLinks = newLinksToAdd.filter(nl => !links.some(existingLink => existingLink.url === nl.url));
        
        setLinks(prevLinks => [...prevLinks, ...uniqueNewLinks]);
        toast({
          title: "New Links Suggested!",
          description: `${uniqueNewLinks.length} new unique links have been added.`,
        });
      } else {
        toast({
          title: "No New Links",
          description: "The AI couldn't find any new links this time, or there was an issue.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to suggest new links:", error);
      toast({
        title: "Error Suggesting Links",
        description: "Could not fetch new link suggestions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNewLinks(false);
    }
  };

  function mapKeywordsToIcon(keywords?: string): string | undefined {
    if (!keywords) return undefined;
    const lowerKeywords = keywords.toLowerCase();
    if (lowerKeywords.includes("code") || lowerKeywords.includes("repository")) return "Github";
    if (lowerKeywords.includes("video") || lowerKeywords.includes("playlist")) return "Youtube"; // Lucide does not have Youtube icon, ensure it's available or mapped.
    if (lowerKeywords.includes("book")) return "BookOpen";
    if (lowerKeywords.includes("learn") || lowerKeywords.includes("education")) return "School";
    if (lowerKeywords.includes("tool") || lowerKeywords.includes("utility") || lowerKeywords.includes("web") || lowerKeywords.includes("site") ) return "Globe";
    if (lowerKeywords.includes("circuit") || lowerKeywords.includes("electronic")) return "Cpu";
    return "Link"; // Default icon
  }


  if (currentTime === null) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Loading page...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button onClick={handleSuggestNewLinks} disabled={isLoadingNewLinks} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoadingNewLinks ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Suggest New Links
          </Button>
        </div>
        
        <Section title="View All" className="w-full">
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
                const IconComponent = link.iconName ? (iconMap[link.iconName] || iconMap["HelpCircle"]) : iconMap["HelpCircle"];
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
                    <CardContent className="flex-grow pl-[calc(1.5rem+0.75rem+theme(spacing.3))] pr-6 pb-6 pt-0">
                      {link.description ? (
                        <p className="text-sm text-card-foreground">{link.description}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No description provided.</p>
                      )}
                    </CardContent>
                    <CardFooter className="pl-[calc(1.5rem+0.75rem+theme(spacing.3))] pr-6 pb-6">
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
        <p>&copy; {currentTime} {siteProfileData.footerName}. All rights reserved.</p>
        <p className="mt-1">Explore more useful links and continue learning.</p>
      </footer>
    </div>
  );
}

