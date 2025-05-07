import { Section } from '@/components/app/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { User, Link2Icon, BookOpen, Settings } from 'lucide-react'; // Changed Link2 to Link2Icon

interface AdminActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function AdminActionCard({ title, description, href, icon }: AdminActionCardProps) {
  return (
    <Link href={href} className="block hover:no-underline">
      <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full bg-card">
        <CardHeader className="flex flex-row items-center gap-4 pb-3">
          {icon}
          <CardTitle className="text-xl text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminDashboardPage() {
  return (
    <>
      <Section title="Website Management" className="text-center !pt-0">
        <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
          Welcome to your website's control center. From here, you can update your personal information, manage contact details, and curate your list of useful links.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <AdminActionCard
            title="Edit Profile"
            description="Update your name, tagline, and profile picture URL."
            href="/admin/profile"
            icon={<User className="w-8 h-8 text-accent" />}
          />
          <AdminActionCard
            title="Manage Contacts"
            description="Add, edit, or remove your personal contact links."
            href="/admin/contacts"
            icon={<Link2Icon className="w-8 h-8 text-accent" />}
          />
          <AdminActionCard
            title="Manage Useful Links"
            description="Curate your collection of useful links and resources."
            href="/admin/useful-links"
            icon={<BookOpen className="w-8 h-8 text-accent" />}
          />
           {/* Example for future expansion:
           <AdminActionCard
            title="Site Settings"
            description="Configure global site settings and preferences."
            href="/admin/settings"
            icon={<Settings className="w-8 h-8 text-accent" />}
          /> */}
        </div>
      </Section>
    </>
  );
}
