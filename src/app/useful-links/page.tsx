
"use client";
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookMarked, Lightbulb, BookOpenCheck, Users, FileText, Landmark, HelpCircle, Search, Github, Code, School, Award, Video, ListVideo, BookOpen, Cpu, Globe, type LucideIcon, Sparkles, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/app/Section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo, useEffect } from 'react';
import { usefulLinksData as initialUsefulLinksData, siteProfileData, addSuggestedLinks as addNewLinksToDataStore } from '@/data/site-data'; 
import type { UsefulLink } from '@/types'; 
import { suggestUsefulLinks, type SuggestUsefulLinksInput, type SuggestedLink } from '@/ai/flows/suggest-useful-links-flow';
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
  Video, // Generic video icon
  ListVideo, // YouTube playlist like icon
  BookOpen,
  Cpu,
  Globe, // For websites
  Youtube: Video, // Map Youtube keyword specifically if needed, Lucide has 'Youtube' but it's a brand icon. Using generic 'Video'.
  Link: ExternalLink, // Default for generic links
  Sparkles, // For "Newest" or "Newly Added"
  TrendingUp, // For "Most Popular"
  Eye, // Could be used for "View Added" button
};

const filterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newly_added', label: 'Recently Suggested'}, // For toast action target
  { value: 'learning', label: 'Learning & Education' },
  { value: 'web', label: 'Websites & Tools' },
  { value: 'project_repository', label: 'Project Repositories' },
  { value: 'book', label: 'Books' },
  { value: 'youtube', label: 'YouTube Content' },
];

// Helper to get category label
const getCategoryLabel = (value?: string) => {
  const option = filterOptions.find(opt => opt.value === value);
  return option ? option.label : (value ? value.charAt(0).toUpperCase() + value.slice(1) : "Link");
};


export default function UsefulLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [links, setLinks] = useState<UsefulLink[]>(initialUsefulLinksData.map(link => ({...link, createdAt: new Date(link.createdAt) }))); // Ensure createdAt is Date object
  const [isLoadingNewLinks, setIsLoadingNewLinks] = useState(false);
  const [newlyAddedLinkIds, setNewlyAddedLinkIds] = useState<string[]>([]);
  const { toast } = useToast();


  useEffect(() => {
    setCurrentTime(new Date().getFullYear().toString());
  }, []);


  const filteredLinks = useMemo(() => {
    let processedLinks = [...links];

    // Apply search term first
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      processedLinks = processedLinks.filter(link => 
        link.title.toLowerCase().includes(term) ||
        (link.author && link.author.toLowerCase().includes(term)) ||
        (link.description && link.description.toLowerCase().includes(term))
      );
    }
    
    // Handle special filters or sort
    if (selectedFilter === 'newest') {
      processedLinks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedFilter === 'popular') {
      processedLinks.sort((a, b) => b.popularity - a.popularity);
    } else if (selectedFilter === 'newly_added') {
      processedLinks = processedLinks.filter(link => newlyAddedLinkIds.includes(link.id))
                                     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedFilter !== 'all') {
      // Category filtering
      processedLinks = processedLinks.filter(link => {
        const linkCategory = link.category;
        return linkCategory === selectedFilter;
      });
    }

    return processedLinks;
  }, [searchTerm, selectedFilter, links, newlyAddedLinkIds]);

  const handleSuggestNewLinks = async () => {
    setIsLoadingNewLinks(true);
    try {
      const input: SuggestUsefulLinksInput = {
        existingLinks: links.map(l => ({ title: l.title, url: l.url })),
      };
      const result = await suggestUsefulLinks(input);
      
      if (result && result.suggestedLinks) {
        // The addSuggestedLinks function in site-data.ts now returns the added links
        const addedLinks: UsefulLink[] = addNewLinksToDataStore(result.suggestedLinks as SuggestedLink[]);

        if (addedLinks.length > 0) {
          setLinks(prevLinks => {
            const updatedLinks = [...prevLinks];
            addedLinks.forEach(newLink => {
              if (!updatedLinks.some(ul => ul.id === newLink.id)) {
                 updatedLinks.push({...newLink, createdAt: new Date(newLink.createdAt) }); // Ensure Date object
              }
            });
            return updatedLinks;
          });

          setNewlyAddedLinkIds(addedLinks.map(l => l.id));
          
          toast({
            title: "New Links Suggested!",
            description: `${addedLinks.length} new unique links have been added.`,
            action: (
              <Button variant="outline" size="sm" onClick={() => {
                setSelectedFilter('newly_added');
                // Scroll to top or to the links section might be good UX here
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <Eye className="mr-2 h-4 w-4" /> View Added
              </Button>
            )
          });
        } else {
          toast({
            title: "No New Links",
            description: "The AI couldn't find any new links this time, or they were duplicates of existing ones.",
            variant: "default"
          });
        }
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
  
  const handleFilterChange = (value: string) => {
    if (selectedFilter === 'newly_added' && value !== 'newly_added') {
      setNewlyAddedLinkIds([]); // Clear newly added if filter changes away from it
    }
    setSelectedFilter(value);
  };


  if (currentTime === null) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading page...</p>
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
              <Select value={selectedFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[220px] bg-background border-input focus:border-primary">
                  <SelectValue placeholder="Filter or Sort" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map(option => (
                     // Hide "Recently Suggested" if no links were recently suggested via toast action
                    (option.value === 'newly_added' && newlyAddedLinkIds.length === 0 && selectedFilter !== 'newly_added') ? null : (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
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
                let IconComp = iconMap["Link"]; // Default icon
                if (selectedFilter === 'newly_added' && newlyAddedLinkIds.includes(link.id)) {
                  IconComp = iconMap["Sparkles"];
                } else if (selectedFilter === 'newest') {
                    IconComp = iconMap["Sparkles"];
                } else if (selectedFilter === 'popular') {
                    IconComp = iconMap["TrendingUp"];
                } else if (link.iconName && iconMap[link.iconName]) {
                  IconComp = iconMap[link.iconName];
                }
                
                return (
                  <Card key={link.id} className="flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <IconComp className="w-6 h-6 mt-1 text-accent flex-shrink-0" />
                        <div className="flex-grow">
                          <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
                          {link.author && <CardDescription>By {link.author}</CardDescription>}
                           <CardDescription className="text-xs mt-1">
                              Category: <span className="font-semibold">{getCategoryLabel(link.category)}</span>
                              {selectedFilter === 'newest' && <span className="ml-2 text-muted-foreground">({link.createdAt.toLocaleDateString()})</span>}
                              {selectedFilter === 'popular' && <span className="ml-2 text-muted-foreground">(Popularity: {link.popularity})</span>}
                           </CardDescription>
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

