
"use client";

import type { UsefulLink } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  BookMarked,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpenCheck,
  Users,
  FileText,
  Landmark,
  HelpCircle,
  ArrowRight,
  Github,
  Code,
  School,
  Award,
  Video,        // For single YouTube videos (outline camera)
  ListVideo,    // Could be used for other video list types
  BookOpen,
  Cpu,
  Youtube,      // For YouTube playlists (brand logo with "filled" play button)
  Link as LinkIcon, // Rename to avoid conflict with NextLink
  type LucideIcon,
} from "lucide-react";
import NextLink from "next/link"; // Use NextLink for navigation
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCategoryLabel } from "@/lib/utils"; // Assuming getCategoryLabel is moved to utils

interface UsefulLinksProps {
  links: UsefulLink[];
  showAllButton?: boolean; // Prop to control visibility of "View All" button
  initialVisibleCount?: number; // Prop to control initial visible links
}

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
  Cpu,
  Youtube,
  Link: LinkIcon, // Map 'Link' string to the imported LinkIcon
};

const DEFAULT_INITIAL_VISIBLE_LINKS = 4;

export function UsefulLinks({
  links,
  showAllButton = true, // Default to true for homepage usage
  initialVisibleCount = DEFAULT_INITIAL_VISIBLE_LINKS // Use default or passed prop
}: UsefulLinksProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  if (!links || links.length === 0) {
    return <p className="text-muted-foreground text-center">No links available at the moment.</p>;
  }

  const visibleLinks = links.slice(0, visibleCount);
  const allLinksShown = visibleCount >= links.length;
  const canShowMore = links.length > initialVisibleCount; // Check if expansion is possible

  const toggleVisibleCount = () => {
    if (allLinksShown) {
      setVisibleCount(initialVisibleCount);
    } else {
      setVisibleCount(links.length);
    }
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleLinks.map((link) => {
          let IconComponent: LucideIcon = iconMap[link.iconName || 'HelpCircle'] || HelpCircle; // Use mapped icon or fallback

          return (
            <Card key={link.id} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-300 ease-in-out">
               <CardHeader>
                 <div className="flex items-start gap-3">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <IconComponent className="w-6 h-6 mt-1 text-accent flex-shrink-0" />
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>{getCategoryLabel(link.category, link.iconName)}</p>
                     </TooltipContent>
                   </Tooltip>
                   <div className="flex-grow">
                    <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
                     {link.author && <CardDescription>By {link.author}</CardDescription>}
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
                  {/* Use standard anchor for external links */}
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Visit Link <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {/* Conditionally render the control buttons */}
      {(canShowMore || showAllButton) && (
        <div className="mt-8 text-center space-y-4 sm:flex sm:flex-row sm:justify-center sm:items-center sm:space-y-0 sm:space-x-4">
          {canShowMore && (
              <Button
                  variant="ghost"
                  onClick={toggleVisibleCount}
                  className="text-accent hover:text-accent hover:bg-accent/10"
              >
                  {allLinksShown ? "Show Less" : "Show More"}
                  {allLinksShown ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
          )}

          {showAllButton && (
             <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                 <NextLink href="/useful-links">
                  View All
                 <ArrowRight className="ml-2 h-4 w-4" />
                 </NextLink>
             </Button>
          )}
        </div>
      )}
     </TooltipProvider>
  );
}
