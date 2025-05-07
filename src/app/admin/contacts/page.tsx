import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdminContactsPage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline">
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Manage Personal Contacts</CardTitle>
          <CardDescription>Add, edit, or remove your contact links.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Contact management interface (list, add, edit, delete forms) will be implemented here.
          </p>
          {/* Placeholder for ContactsManager component */}
        </CardContent>
      </Card>
    </div>
  );
}
