import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdminProfilePage() {
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
          <CardTitle>Manage Profile</CardTitle>
          <CardDescription>Update your personal information displayed on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Profile editing form will be implemented here. You'll be able to change your name, tagline, profile picture URL, and other site-wide information.
          </p>
          {/* Placeholder for ProfileForm component */}
        </CardContent>
      </Card>
    </div>
  );
}
