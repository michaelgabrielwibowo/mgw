
import type { UsefulLink } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookMarked } from "lucide-react";
import Link from "next/link";

interface UsefulLinksProps {
  links: UsefulLink[];
}

export function UsefulLinks({ links }: UsefulLinksProps) {
  if (!links || links.length === 0) {
    return <p className="text-muted-foreground text-center">No links available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {links.map((link) => {
        const IconComponent = link.icon || BookMarked;
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
  );
}
