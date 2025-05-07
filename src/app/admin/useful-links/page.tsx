import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdminUsefulLinksPage() {
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
          <CardTitle>Manage Useful Links</CardTitle>
          <CardDescription>Curate your collection of links and resources.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Useful links management interface (list, add, edit, delete forms) will be implemented here.
          </p>
          {/* Placeholder for UsefulLinksManager component */}
        </CardContent>
      </Card>
    </div>
  );
}
