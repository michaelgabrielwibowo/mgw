
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
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UsefulLinksProps {
  links: UsefulLink[];
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
  Video,        // For single YouTube videos (outline camera)
  ListVideo,    // Available for other list-like video content if needed
  BookOpen,
  Cpu,
  Youtube,      // For YouTube playlists (brand logo with "filled" play button)
};

const INITIAL_VISIBLE_LINKS = 4;

export function UsefulLinks({ links }: UsefulLinksProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_LINKS);

  if (!links || links.length === 0) {
    return <p className="text-muted-foreground text-center">No links available at the moment.</p>;
  }

  const visibleLinks = links.slice(0, visibleCount);
  const allLinksShown = visibleCount >= links.length;

  const toggleVisibleCount = () => {
    if (allLinksShown) {
      setVisibleCount(INITIAL_VISIBLE_LINKS);
    } else {
      setVisibleCount(links.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleLinks.map((link) => {
          let IconComponent = HelpCircle; // Default icon
          if (link.iconName && iconMap[link.iconName]) {
            // Specific mapping for YouTube icons based on the name provided in data
            if (link.iconName === 'Youtube') IconComponent = Youtube; // Brand logo (filled play button) for playlists
            else if (link.iconName === 'Video') IconComponent = Video; // Camera outline (empty paint) for single videos
            else IconComponent = iconMap[link.iconName];
          }
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
      {(links.length > INITIAL_VISIBLE_LINKS) && (
        <div className="mt-8 text-center space-y-4 sm:flex sm:flex-row sm:justify-center sm:items-center sm:space-y-0 sm:space-x-4">
          <Button
            variant="ghost"
            onClick={toggleVisibleCount}
            className="text-accent hover:text-accent hover:bg-accent/10"
          >
            {allLinksShown ? "Show Less" : "Show More"}
            {allLinksShown ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
          
          
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/useful-links">
                View All 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          
        </div>
      )}
    </>
  );
}
