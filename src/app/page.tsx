import Image from "next/image";
import { PersonalContacts } from "@/components/app/PersonalContacts";
import { UsefulLinks } from "@/components/app/UsefulLinks";
import { FeedbackForm } from "@/components/app/FeedbackForm";
import { Section } from "@/components/app/Section";
import { Separator } from "@/components/ui/separator";
import { siteProfileData, personalContactsData, getUsefulLinks } from "@/data/site-data"; // Import getUsefulLinks
import { ThemeToggle } from "@/components/app/ThemeToggle";

export default async function HomePage() {
  // Fetch useful links on the server
  const usefulLinks = await getUsefulLinks();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl flex flex-col items-center animate-in fade-in duration-700">
        {/* Profile Section */}
        <section className="mb-10 md:mb-16 text-center w-full">
          <div className="flex justify-center mb-6">
            <Image
              src={siteProfileData.profilePictureUrl} // Use profile picture URL from data
              alt={`${siteProfileData.profileName} - Profile Picture`}
              width={160}
              height={160}
              className="rounded-full shadow-xl border-4 border-background object-cover"
              priority
              data-ai-hint="profile picture"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {siteProfileData.profileName}
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mt-3 max-w-2xl mx-auto">
            {siteProfileData.tagline}
          </p>
        </section>

        <Separator className="my-6 md:my-10 bg-border/70" />

        <Section title="Get in Touch" className="w-full">
          {/* Pass static contacts data */}
          <PersonalContacts contacts={personalContactsData} />
        </Section>

        <Separator className="my-6 md:my-10 bg-border/70" />

        <Section title="Curated Links & Resources" className="w-full">
          {/* Pass fetched links to the client component */}
          <UsefulLinks links={usefulLinks.slice(0, 6)} />
        </Section>

        <Separator className="my-6 md:my-10 bg-border/70" />

        <Section title="Leave a Comment or Feedback" className="w-full">
          <FeedbackForm />
        </Section>
      </main>

      <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
           <p>&copy; {new Date().getFullYear()} {siteProfileData.footerName}. All rights reserved.</p>
           <p className="mt-1 sm:mt-0">Built with Next.js and Tailwind CSS.</p>
           <div className="mt-2 sm:mt-0">
             <ThemeToggle />
           </div>
        </div>
      </footer>
    </div>
  );
}
