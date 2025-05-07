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
  HelpCircle, // Fallback icon
  ArrowRight, // Added for the new button
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
  BookMarked, // Default/fallback for links without specific icons
  HelpCircle, // Generic fallback
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
              <CardContent className="flex-grow pl-[calc(1.5rem+1.5rem+0.75rem)] pr-6 pb-6 pt-0"> {/* Adjust padding to align with title */}
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
          
          {allLinksShown && (
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/useful-links">
                View All Links Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
}
