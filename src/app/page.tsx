
import Image from "next/image";
import { PersonalContacts } from "@/components/app/PersonalContacts";
import { UsefulLinks } from "@/components/app/UsefulLinks";
import { FeedbackForm } from "@/components/app/FeedbackForm";
import { Section } from "@/components/app/Section";
import { Separator } from "@/components/ui/separator";
import type { PersonalContact, UsefulLink } from "@/types";
import { Mail, Linkedin, Github, Globe, BookOpenCheck, Users, Lightbulb, FileText, Landmark } from "lucide-react"; // Example icons, added new ones

// Mock Data (replace with actual data fetching in a real app)
const mockPersonalContacts: PersonalContact[] = [
  { id: "1", title: "Email", value: "your.email@example.com", url: "mailto:your.email@example.com", icon: Mail },
  { id: "2", title: "LinkedIn", value: "Your LinkedIn Profile", url: "https://linkedin.com/in/yourprofile", icon: Linkedin },
  { id: "3", title: "GitHub", value: "Your GitHub Profile", url: "https://github.com/yourusername", icon: Github },
  { id: "4", title: "Portfolio", value: "yourwebsite.com", url: "https://yourwebsite.com", icon: Globe },
];

const mockUsefulLinks: UsefulLink[] = [
  {
    id: "1",
    title: "NotebookLM",
    author: "Google",
    url: "https://notebooklm.google.com/",
    description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
    icon: Lightbulb,
  },
  {
    id: "2",
    title: "OpenStax",
    author: "Rice University",
    url: "https://openstax.org/",
    description: "Access free, peer-reviewed, openly licensed textbooks for college and AP courses.",
    icon: BookOpenCheck,
  },
  {
    id: "3",
    title: "Khan Academy",
    author: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description: "Offers practice exercises, instructional videos, and a personalized learning dashboard.",
    icon: Users,
  },
  {
    id: "4",
    title: "Project Gutenberg",
    author: "Various Volunteers",
    url: "https://www.gutenberg.org/",
    description: "A library of over 70,000 free eBooks, with a focus on older works for which U.S. copyright has expired.",
    icon: FileText,
  },
  {
    id: "5",
    title: "MIT OpenCourseWare",
    author: "MIT",
    url: "https://ocw.mit.edu/",
    description: "A web-based publication of virtually all MIT course content, open and available to the world.",
    icon: Landmark,
  },
  {
    id: "6",
    title: "Next.js Documentation",
    author: "Vercel",
    url: "https://nextjs.org/docs",
    description: "The official documentation for Next.js, a React framework for PWA."
  },
  {
    id: "7",
    title: "Tailwind CSS",
    author: "Tailwind Labs",
    url: "https://tailwindcss.com/docs",
    description: "A utility-first CSS framework for rapid UI development."
  },
  {
    id: "8",
    title: "Shadcn/ui",
    url: "https://ui.shadcn.com/",
    description: "Beautifully designed components that you can copy and paste into your apps."
  },
];


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-4xl flex flex-col items-center animate-in fade-in duration-700">
        {/* Profile Section */}
        <section className="mb-10 md:mb-16 text-center w-full">
          <div className="flex justify-center mb-6">
            <Image
              src="https://picsum.photos/160/160" // Replace with your actual image path
              alt="Your Name - Profile Picture"
              width={160}
              height={160}
              className="rounded-full shadow-xl border-4 border-background object-cover"
              priority
              data-ai-hint="profile picture"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Your Name Here {/* TODO: User to update */}
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mt-3 max-w-2xl mx-auto">
            Your Professional Tagline or Brief Bio. Something catchy and descriptive! {/* TODO: User to update */}
          </p>
        </section>

        <Separator className="my-6 md:my-10 bg-border/70" />

        <Section title="Get in Touch" className="w-full">
          <PersonalContacts contacts={mockPersonalContacts} />
        </Section>

        <Separator className="my-6 md:my-10 bg-border/70" />

        <Section title="Curated Links & Resources" className="w-full">
          <UsefulLinks links={mockUsefulLinks} />
        </Section>

        <Separator className="my-6 md:my-10 bg-border/70" />

        <Section title="Leave a Comment or Feedback" className="w-full">
          <FeedbackForm />
        </Section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p> {/* TODO: User to update */}
        <p className="mt-1">Built with Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
