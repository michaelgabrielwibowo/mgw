
import Image from "next/image";
import { PersonalContacts } from "@/components/app/PersonalContacts";
import { UsefulLinks } from "@/components/app/UsefulLinks";
import { FeedbackForm } from "@/components/app/FeedbackForm";
import { Section } from "@/components/app/Section";
import { Separator } from "@/components/ui/separator";
import { siteProfileData, personalContactsData, getUsefulLinks } from "@/data/site-data"; // Import getUsefulLinks
import { ThemeToggle } from "@/components/app/ThemeToggle";
import type { UsefulLink } from "@/types"; // Import UsefulLink type

export default async function HomePage() {
  // Fetch links on the server
  let usefulLinks: UsefulLink[] = [];
  try {
    usefulLinks = await getUsefulLinks();
    // Keep only the first 6 links for the homepage display
    usefulLinks = usefulLinks.slice(0, 6);
  } catch (error) {
    // Log detailed error but don't block rendering
    console.error("-----------------------------------------------------");
    console.error("Failed to fetch useful links for homepage:");
    if (error instanceof Error) {
      console.error(`Code: ${(error as any).code}, Message: ${error.message}`);
      if (error.message?.includes('Getting metadata from plugin failed') || error.message?.includes('Could not refresh access token')) {
        console.warn("Firebase ADC Hint: This often indicates an issue with Firebase Admin SDK authentication or permissions.");
        console.warn("Check Firebase Admin initialization logs and ensure ADC are configured (run `gcloud auth application-default login`, `gcloud config set project YOUR_PROJECT_ID`, check IAM).");
      } else if ((error as any).code === 7) { // Firestore permission denied
        console.warn("Firebase Permission Denied: Check Firestore security rules and IAM permissions.");
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
    console.error("-----------------------------------------------------");
    // Fallback to empty array, page will render without links section content
    usefulLinks = [];
  }


  // --- Start of the actual HomePage component's return statement ---
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
          {/* Pass fetched links (up to 6) to the client component */}
          <UsefulLinks links={usefulLinks} />
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
