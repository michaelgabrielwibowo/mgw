import type { UsefulLink } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
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
      {links.map((link) => (
        <Card key={link.id} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="text-xl text-primary">{link.title}</CardTitle>
            {link.author && <CardDescription>By {link.author}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-grow">
            {link.description ? (
              <p className="text-sm text-card-foreground">{link.description}</p>
            ) : (
               <p className="text-sm text-muted-foreground italic">No description provided.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                Visit Link <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
