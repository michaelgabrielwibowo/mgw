
"use client";
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookMarked, Lightbulb, BookOpenCheck, Users, FileText, Landmark, HelpCircle, Search, Github, Code, School, Award, Video, ListVideo, BookOpen, Cpu, Globe, Link as LinkIcon, Sparkles, TrendingUp, Eye, Youtube, Download, Loader2, Sheet, FileSpreadsheet, FileTextIcon } from 'lucide-react';
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useState, useMemo, useEffect } from 'react';
// Import functions to interact with Firestore data
import { getUsefulLinks, addSuggestedLinks, siteProfileData } from '@/data/site-data';
import type { UsefulLink } from '@/types';
import { suggestUsefulLinks, type SuggestUsefulLinksInput, type SuggestedLink } from '@/ai/flows/suggest-useful-links-flow';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/app/ThemeToggle';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getCategoryLabel } from '@/lib/utils'; // Assuming getCategoryLabel is moved to utils


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
  Link: LinkIcon, // Map 'Link' string to the imported LinkIcon
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
  { value: 'website', label: 'Websites & Tools' },
  { value: 'project_repository', label: 'Project Repositories' },
  { value: 'book', label: 'Books' },
  { value: 'youtube', label: 'YouTube Content' },
];


export default function UsefulLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  // State to hold links fetched from Firestore
  const [links, setLinks] = useState<UsefulLink[]>([]);
  const [isFetchingLinks, setIsFetchingLinks] = useState(true); // Loading state for initial fetch
  const [isLoadingNewLinks, setIsLoadingNewLinks] = useState(false); // Loading state for suggesting new links
  const { toast } = useToast();


  // Fetch initial links from Firestore on component mount
  useEffect(() => {
    async function fetchLinks() {
        setIsFetchingLinks(true);
        try {
            const fetchedLinks = await getUsefulLinks();
            setLinks(fetchedLinks);
        } catch (error) {
            console.error("Failed to fetch useful links:", error);
            toast({
                title: "Error Loading Links",
                description: "Could not fetch links from the database. Please try again later.",
                variant: "destructive",
            });
            setLinks([]); // Set to empty array on error
        } finally {
            setIsFetchingLinks(false);
        }
    }
    fetchLinks();
  }, [toast]); // Add toast to dependency array


  useEffect(() => {
    setCurrentTime(new Date().getFullYear().toString());
  }, []);


  const filteredLinks = useMemo(() => {
    let processedLinks = [...links];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      processedLinks = processedLinks.filter(link =>
        link.title.toLowerCase().includes(term) ||
        (link.author && link.author.toLowerCase().includes(term)) ||
        (link.description && link.description.toLowerCase().includes(term))
      );
    }

    // Apply category/sort filter
    if (selectedFilter === 'newest') {
      processedLinks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedFilter === 'popular') {
      // Ensure popularity is treated as a number for sorting
      processedLinks.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (selectedFilter === 'newly_added') {
      processedLinks = processedLinks.filter(link => link.isNew === true)
                                     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedFilter !== 'all') {
      processedLinks = processedLinks.filter(link => {
        const linkCategory = link.category;
        return linkCategory === selectedFilter;
      });
    } else {
       // Default sort by creation date (newest first) when 'All Categories' is selected, unless already sorted by 'newest' or 'popular'
       if (!['newest', 'popular'].includes(selectedFilter)) {
           processedLinks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
       }
    }


    return processedLinks;
  }, [searchTerm, selectedFilter, links]);

  const handleSuggestNewLinks = async () => {
    setIsLoadingNewLinks(true);
    try {
      // Use the current state of links to avoid suggesting duplicates already in view
      const currentLinksForInput = links.map(l => ({ title: l.title, url: l.url }));
      const input: SuggestUsefulLinksInput = {
        existingLinks: currentLinksForInput,
      };
      console.log("Calling suggestUsefulLinks server action with input:", input);
      const result = await suggestUsefulLinks(input);
      console.log("Received result from suggestUsefulLinks:", result);


      if (result && result.suggestedLinks) {
         // Call the server action/function to add links to Firestore
        const addedLinks = await addSuggestedLinks(result.suggestedLinks as SuggestedLink[]);
        console.log("Added links to data store:", addedLinks);

        if (addedLinks.length > 0) {
           // Update local state by adding the newly added links
           // Ensure createdAt is a Date object if it's not already
           const newLinksWithDate = addedLinks.map(link => ({
               ...link,
               createdAt: link.createdAt instanceof Date ? link.createdAt : new Date(link.createdAt),
           }));
           setLinks(prevLinks => [...newLinksWithDate, ...prevLinks]);
           console.log("Updated local links state with new additions.");


          toast({
            title: "New Links Suggested!",
            description: `${addedLinks.length} new unique links have been added.`,
            action: (
              <Button variant="outline" size="sm" onClick={() => {
                setSelectedFilter('newly_added'); // Set filter to show newly added
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <Eye className="mr-2 h-4 w-4" /> View Added
              </Button>
            )
          });
        } else {
           console.log("No new unique links were added.");
          toast({
            title: "No New Links",
            description: "The AI couldn't find any new links this time, or they were duplicates of existing ones.",
            variant: "default"
          });
        }
      } else {
        console.error("AI did not return expected result structure:", result);
        throw new Error("AI did not return suggested links in the expected format.");
      }
    } catch (error) {
      console.error("Failed to suggest or add new links:", error);
       let description = "Could not fetch or save new link suggestions. Please try again later.";
       if (error instanceof Error) {
           description = error.message || description;
       }
      toast({
        title: "Error Suggesting Links",
        description: description,
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

  const handleExport = (format: 'txt' | 'csv' ) => {
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
        return `Title: ${link.title}\nURL: ${link.url}\nAuthor: ${link.author || 'N/A'}\nDescription: ${link.description || 'N/A'}\nCategory: ${getCategoryLabel(link.category, link.iconName)}\nCreated At: ${link.createdAt instanceof Date ? link.createdAt.toISOString() : link.createdAt}\nPopularity: ${link.popularity}\nIs New: ${link.isNew ? 'Yes' : 'No'}\n---`;
      }).join("\n\n");
    } else if (format === 'csv') {
      filename += ".csv";
      mimeType = "text/csv;charset=utf-8;";
      const header = ["ID", "Title", "URL", "Author", "Description", "Category", "Icon Name", "Created At", "Popularity", "Is New"];

      // Helper to escape CSV values
      const escapeCsvValue = (value: string | number | boolean | Date | undefined | null) => {
        if (value === undefined || value === null) return "";
        let str = value instanceof Date ? value.toISOString() : String(value);
        // Ensure strings containing comma, double quote, or newline are enclosed in double quotes
        if (/[",\n]/.test(str)) { // Corrected regex to include newline
             // Escape existing double quotes by doubling them
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
        escapeCsvValue(link.createdAt), // Already a Date object or string
        escapeCsvValue(link.popularity),
        escapeCsvValue(link.isNew ? 'Yes' : 'No') // Make boolean more readable
      ].join(","));
      content = [header.join(","), ...rows].join("\n");
    } else {
        toast({ title: "Export Error", description: "Unsupported export format.", variant: "destructive" });
        return;
    }


    try {
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
    } catch (exportError) {
        console.error("Export failed:", exportError);
        toast({
            title: "Export Failed",
            description: "Could not generate or download the export file.",
            variant: "destructive",
          });
    }
  };


  if (currentTime === null || isFetchingLinks) { // Show loader while fetching initial links too
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading links...</p>
      </div>
    );
  }

  return (
     <TooltipProvider>
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
                    <FileTextIcon className="mr-2 h-4 w-4"/> Export as TXT
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4"/> Export as CSV
                  </DropdownMenuItem>
                  {/* <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => handleExport('google_sheets')} disabled>
                     <Sheet className="mr-2 h-4 w-4" /> Export to Google Sheets (Soon)
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleExport('google_docs')} disabled>
                    <FileText className="mr-2 h-4 w-4" /> Export to Google Docs (Soon)
                  </DropdownMenuItem> */}
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
              <p className="text-muted-foreground text-center py-10">No links match your criteria. Try adjusting your search or filters, or suggesting new links!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLinks.map((link) => {
                   let IconComp: LucideIcon = iconMap[link.iconName || 'HelpCircle'] || HelpCircle; // Use mapped icon or fallback

                  return (
                    <Card key={link.id} className={`flex flex-col bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out ${link.isNew ? 'border-2 border-primary/50' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <IconComp className="w-6 h-6 mt-1 text-accent flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent>
                                 <p>{getCategoryLabel(link.category, link.iconName)}</p>
                              </TooltipContent>
                           </Tooltip>
                          <div className="flex-grow">
                            <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
                            {link.author && <CardDescription>By {link.author}</CardDescription>}
                             <CardDescription className="text-xs mt-1">
                                {selectedFilter === 'newest' && link.createdAt instanceof Date && <span className="text-muted-foreground">Added: {link.createdAt.toLocaleDateString()}</span>}
                                {selectedFilter === 'popular' && <span className="text-muted-foreground">Popularity: {link.popularity || 0}</span>}
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
                           {/* Use standard anchor for external link */}
                           <a href={link.url} target="_blank" rel="noopener noreferrer">
                             Visit Link <ExternalLink className="ml-2 h-4 w-4" />
                           </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </Section>
        </main>
        <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t border-border/50">
           <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
             <p>&copy; {currentTime} {siteProfileData.footerName}. All rights reserved.</p>
             <p className="mt-1 sm:mt-0">Explore more useful links and continue learning.</p>
             <div className="mt-2 sm:mt-0">
                <ThemeToggle />
             </div>
           </div>
        </footer>
      </div>
     </TooltipProvider>
  );
}

