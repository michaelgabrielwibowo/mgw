
"use client";
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookMarked, Lightbulb, BookOpenCheck, Users, FileText, Landmark, HelpCircle, Search, Github, Code, School, Award, Video, ListVideo, BookOpen, Cpu, Globe, type LucideIcon, Sparkles, TrendingUp, Eye, Youtube, Download, Loader2 } from 'lucide-react'; // Added Download, Loader2
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/components/app/Section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo, useEffect } from 'react';
import { usefulLinksData as initialUsefulLinksData, siteProfileData, addSuggestedLinks as addNewLinksToDataStore } from '@/data/site-data'; 
import type { UsefulLink } from '@/types'; 
import { suggestUsefulLinks, type SuggestUsefulLinksInput, type SuggestedLink } from '@/ai/flows/suggest-useful-links-flow';
import { useToast } from '@/hooks/use-toast';


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
  Video,        // For single YouTube videos (outline camera icon)
  ListVideo,    // Available for other list-like video content if needed
  BookOpen,
  Cpu,
  Globe,        // For websites
  Youtube,      // For YouTube playlists (brand logo with "filled" play button icon)
  Link: ExternalLink, 
  Sparkles, 
  TrendingUp, 
  Eye, 
};

const filterOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newly_added', label: 'Recently Suggested'}, 
  { value: 'learning', label: 'Learning & Education' },
  { value: 'web', label: 'Websites & Tools' },
  { value: 'project_repository', label: 'Project Repositories' },
  { value: 'book', label: 'Books' },
  { value: 'youtube', label: 'YouTube Content' }, 
];

// Helper to get category label
const getCategoryLabel = (categoryValue?: string, iconNameValue?: string) => {
  if (categoryValue === 'youtube') {
    if (iconNameValue === 'Video') return 'YouTube Video';
    if (iconNameValue === 'Youtube') return 'YouTube Playlist';
    return 'YouTube Content'; // Fallback for general YouTube category
  }
  const option = filterOptions.find(opt => opt.value === categoryValue);
  return option ? option.label : (categoryValue ? categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1) : "Link");
};


export default function UsefulLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [links, setLinks] = useState<UsefulLink[]>(initialUsefulLinksData.map(link => ({...link, createdAt: new Date(link.createdAt) }))); 
  const [isLoadingNewLinks, setIsLoadingNewLinks] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    setCurrentTime(new Date().getFullYear().toString());
  }, []);


  const filteredLinks = useMemo(() => {
    let processedLinks = [...links];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      processedLinks = processedLinks.filter(link => 
        link.title.toLowerCase().includes(term) ||
        (link.author && link.author.toLowerCase().includes(term)) ||
        (link.description && link.description.toLowerCase().includes(term))
      );
    }
    
    if (selectedFilter === 'newest') {
      processedLinks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedFilter === 'popular') {
      processedLinks.sort((a, b) => b.popularity - a.popularity);
    } else if (selectedFilter === 'newly_added') {
      processedLinks = processedLinks.filter(link => link.isNew === true)
                                     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedFilter !== 'all') {
      processedLinks = processedLinks.filter(link => {
        const linkCategory = link.category;
        return linkCategory === selectedFilter;
      });
    }

    return processedLinks;
  }, [searchTerm, selectedFilter, links]);

  const handleSuggestNewLinks = async () => {
    setIsLoadingNewLinks(true);
    try {
      const input: SuggestUsefulLinksInput = {
        existingLinks: links.map(l => ({ title: l.title, url: l.url })),
      };
      const result = await suggestUsefulLinks(input);
      
      if (result && result.suggestedLinks) {
        const addedLinks: UsefulLink[] = addNewLinksToDataStore(result.suggestedLinks as SuggestedLink[]);

        if (addedLinks.length > 0) {
          setLinks(prevLinks => {
            const updatedLinksList = [...prevLinks];
            addedLinks.forEach(newLink => {
              const completeNewLink = { ...newLink, createdAt: new Date(newLink.createdAt), isNew: true };
              const existingLinkIndex = updatedLinksList.findIndex(ul => ul.id === completeNewLink.id || ul.url === completeNewLink.url);
              if (existingLinkIndex === -1) {
                 updatedLinksList.push(completeNewLink); 
              } else {
                updatedLinksList[existingLinkIndex] = { ...updatedLinksList[existingLinkIndex], ...completeNewLink, isNew: true};
              }
            });
            return updatedLinksList;
          });
          
          toast({
            title: "New Links Suggested!",
            description: `${addedLinks.length} new unique links have been added.`,
            action: (
              <Button variant="outline" size="sm" onClick={() => {
                setSelectedFilter('newly_added');
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
    setSelectedFilter(value);
  };

  const hasNewlyAddedLinks = useMemo(() => links.some(link => link.isNew === true), [links]);

  const handleExport = (format: 'txt' | 'csv') => {
    if (filteredLinks.length === 0) {
      toast({
        title: "No links to export",
        description: "Please refine your filters or add some links.",
        variant: "default",
      });
      return;
    }

    let content = "";
    let filename = "useful_links";
    let mimeType = "";

    if (format === 'txt') {
      filename += ".txt";
      mimeType = "text/plain;charset=utf-8;";
      content = filteredLinks.map(link => {
        return `Title: ${link.title}\nURL: ${link.url}\nAuthor: ${link.author || 'N/A'}\nDescription: ${link.description || 'N/A'}\nCategory: ${getCategoryLabel(link.category, link.iconName)}\nCreated At: ${link.createdAt.toISOString()}\nPopularity: ${link.popularity}\n---`;
      }).join("\n\n");
    } else if (format === 'csv') {
      filename += ".csv";
      mimeType = "text/csv;charset=utf-8;";
      const header = ["ID", "Title", "URL", "Author", "Description", "Category", "Icon Name", "Created At", "Popularity", "Is New"];
      
      // Helper to escape CSV values
      const escapeCsvValue = (value: string | number | boolean | Date | undefined | null) => {
        if (value === undefined || value === null) return "";
        let str = value instanceof Date ? value.toISOString() : String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          str = '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      const rows = filteredLinks.map(link => [
        escapeCsvValue(link.id),
        escapeCsvValue(link.title),
        escapeCsvValue(link.url),
        escapeCsvValue(link.author),
        escapeCsvValue(link.description),
        escapeCsvValue(getCategoryLabel(link.category, link.iconName)),
        escapeCsvValue(link.iconName),
        escapeCsvValue(link.createdAt),
        escapeCsvValue(link.popularity),
        escapeCsvValue(link.isNew)
      ].join(","));
      content = [header.join(","), ...rows].join("\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const linkElement = document.createElement("a");
    linkElement.href = URL.createObjectURL(blob);
    linkElement.download = filename;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(linkElement.href);

    toast({
      title: `Exported as ${format.toUpperCase()}`,
      description: `${filteredLinks.length} links have been exported to ${filename}.`,
    });
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
          <div className="flex gap-2">
            <Button onClick={handleSuggestNewLinks} disabled={isLoadingNewLinks} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoadingNewLinks ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Suggest New Links
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('txt')}>
                  Export as TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                {/* <DropdownMenuItem disabled>Export as PDF (Coming Soon)</DropdownMenuItem> */}
                {/* <DropdownMenuItem disabled>Export as DOCX (Coming Soon)</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                    (option.value === 'newly_added' && !hasNewlyAddedLinks && selectedFilter !== 'newly_added') ? null : (
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
                let IconComp: LucideIcon = iconMap["Link"]; 
                
                if (link.isNew && selectedFilter === 'newly_added') { 
                  IconComp = iconMap["Sparkles"];
                } else if (selectedFilter === 'newest') {
                    IconComp = iconMap["Sparkles"];
                } else if (selectedFilter === 'popular') {
                    IconComp = iconMap["TrendingUp"];
                } else if (link.iconName && iconMap[link.iconName]) {
                    if (link.iconName === 'Youtube') IconComp = Youtube; 
                    else if (link.iconName === 'Video') IconComp = Video; 
                    else IconComp = iconMap[link.iconName];
                }
                
                return (
                  <Card key={link.id} className={`flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out ${link.isNew ? 'border-2 border-primary/50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <IconComp className="w-6 h-6 mt-1 text-accent flex-shrink-0" />
                        <div className="flex-grow">
                          <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
                          {link.author && <CardDescription>By {link.author}</CardDescription>}
                           <CardDescription className="text-xs mt-1">
                              Category: <span className="font-semibold">{getCategoryLabel(link.category, link.iconName)}</span>
                              {selectedFilter === 'newest' && <span className="ml-2 text-muted-foreground">({link.createdAt.toLocaleDateString()})</span>}
                              {selectedFilter === 'popular' && <span className="ml-2 text-muted-foreground">(Popularity: {link.popularity})</span>}
                              {link.isNew && <span className="ml-2 text-green-500 font-semibold">(New)</span>}
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

