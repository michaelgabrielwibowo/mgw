import type { PersonalContact } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PersonalContactsProps {
  contacts: PersonalContact[];
}

export function PersonalContacts({ contacts }: PersonalContactsProps) {
  if (!contacts || contacts.length === 0) {
    return <p className="text-muted-foreground text-center">No contact information available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-lg transition-shadow duration-300 ease-in-out bg-card">
          <Link href={contact.url} target="_blank" rel="noopener noreferrer" passHref>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <contact.icon className="w-10 h-10 mb-4 text-accent" />
              <h3 className="text-lg font-medium text-card-foreground mb-1">{contact.title}</h3>
              <p className="text-sm text-muted-foreground break-all">{contact.value}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
