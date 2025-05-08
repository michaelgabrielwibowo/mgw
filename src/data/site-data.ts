
import type { SiteProfile, PersonalContact, UsefulLink } from '@/types';
import type { SuggestedLink } from '@/ai/flows/suggest-useful-links-flow';

export let siteProfileData: SiteProfile = {
  siteTitle: 'PersonaLink | Michael Gabriel Wibowo | Personal Page',
  metaDescriptionName: 'Michael Gabriel Wibowo',
  profileName: 'Michael Gabriel Wibowo',
  tagline: 'International Student from Indonesia at Tunghai University, Taiwan',
  profilePictureUrl: 'https://picsum.photos/160/160', // Placeholder, user can update in admin
  footerName: 'Michael Gabriel Wibowo',
};

export let personalContactsData: PersonalContact[] = [
  { id: "2", title: "LinkedIn", value: "Michael Gabriel Wibowo", url: "https://www.linkedin.com/in/michael-gabriel-wibowo", iconName: "Linkedin" },
  { id: "1", title: "Email", value: "michaelgabrielwibowo@gmail.com", url: "mailto:michaelgabrielwibowo@gmail.com", iconName: "Mail" },
  { id: "4", title: "WhatsApp", value: "+(886) 936-147-487", url: "https://wa.me/qr/SN33DTMONLEIM1", iconName: "Whatsapp" },
];

// This array will be mutated by addSuggestedLinks to simulate persistence
export let usefulLinksData: UsefulLink[] = [
  {
    id: "1",
    title: "NotebookLM",
    author: "Google",
    url: "https://notebooklm.google.com/",
    description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
    iconName: "Lightbulb",
    category: "web",
    createdAt: new Date("2023-01-01T10:00:00Z"),
    popularity: 85,
  },
  {
    id: "2",
    title: "OpenStax",
    author: "Rice University",
    url: "https://openstax.org/",
    description: "Access free, peer-reviewed, openly licensed textbooks for college and AP courses.",
    iconName: "BookOpenCheck",
    category: "learning",
    createdAt: new Date("2023-01-10T10:00:00Z"),
    popularity: 90,
  },
  {
    id: "3",
    title: "Khan Academy",
    author: "Khan Academy",
    url: "https://www.khanacademy.org/",
    description: "Offers practice exercises, instructional videos, and a personalized learning dashboard.",
    iconName: "Users",
    category: "learning",
    createdAt: new Date("2023-02-01T10:00:00Z"),
    popularity: 95,
  },
  {
    id: "4",
    title: "Project Gutenberg",
    author: "Various Volunteers",
    url: "https://www.gutenberg.org/",
    description: "A library of over 70,000 free eBooks, with a focus on older works for which U.S. copyright has expired.",
    iconName: "BookOpen",
    category: "book",
    createdAt: new Date("2023-02-15T10:00:00Z"),
    popularity: 80,
  },
  {
    id: "5",
    title: "MIT OpenCourseWare",
    author: "MIT",
    url: "https://ocw.mit.edu/",
    description: "A web-based publication of virtually all MIT course content, open and available to the world.",
    iconName: "Landmark",
    category: "learning",
    createdAt: new Date("2023-03-01T10:00:00Z"),
    popularity: 88,
  },
  {
    id: "6",
    title: "Next.js Documentation",
    author: "Vercel",
    url: "https://nextjs.org/docs",
    description: "The official documentation for Next.js, a React framework for PWA.",
    iconName: "BookMarked",
    category: "web",
    createdAt: new Date("2023-03-10T10:00:00Z"),
    popularity: 92,
  },
  {
    id: "7",
    title: "Tailwind CSS",
    author: "Tailwind Labs",
    url: "https://tailwindcss.com/docs",
    description: "A utility-first CSS framework for rapid UI development.",
    iconName: "BookMarked",
    category: "web",
    createdAt: new Date("2023-04-01T10:00:00Z"),
    popularity: 91,
  },
  {
    id: "8",
    title: "Shadcn/ui",
    url: "https://ui.shadcn.com/",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    iconName: "BookMarked",
    category: "web",
    createdAt: new Date("2023-04-15T10:00:00Z"),
    popularity: 93,
  },
  {
    id: "9",
    title: "Genkit GitHub Repository",
    author: "Google",
    url: "https://github.com/firebase/genkit",
    description: "The official GitHub repository for Genkit, a toolkit for building AI-powered applications.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-05-01T10:00:00Z"),
    popularity: 89,
  },
  {
    id: "10",
    title: "Mozilla Developer Network (MDN)",
    author: "Mozilla",
    url: "https://developer.mozilla.org/",
    description: "Comprehensive documentation for web standards and technologies.",
    iconName: "BookOpenCheck",
    category: "web",
    createdAt: new Date("2023-05-10T10:00:00Z"),
    popularity: 94,
  },
  {
    id: "11",
    title: "React Official Website",
    author: "Meta",
    url: "https://react.dev",
    description: "The official website for React, a JavaScript library for building user interfaces.",
    iconName: "BookMarked",
    category: "web",
    createdAt: new Date("2023-06-01T10:00:00Z"),
    popularity: 87,
  },
  {
    id: "12",
    title: "VS Code GitHub Repository",
    author: "Microsoft",
    url: "https://github.com/microsoft/vscode",
    description: "The GitHub repository for Visual Studio Code, a popular open-source code editor.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-06-15T10:00:00Z"),
    popularity: 96,
  },
  {
    id: "13",
    title: "freeCodeCamp",
    author: "freeCodeCamp.org",
    url: "https://www.freecodecamp.org/",
    description: "Learn to code for free. Build projects. Earn certifications.",
    iconName: "Code",
    category: "learning",
    createdAt: new Date("2023-07-01T10:00:00Z"),
    popularity: 97,
  },
  {
    id: "14",
    title: "edX",
    author: "2U",
    url: "https://www.edx.org/",
    description: "Access 2000 free online courses from 140 leading institutions worldwide.",
    iconName: "School",
    category: "learning",
    createdAt: new Date("2023-07-10T10:00:00Z"),
    popularity: 86,
  },
  {
    id: "15",
    title: "Coursera",
    author: "Coursera Inc.",
    url: "https://www.coursera.org/",
    description: "Build skills with courses, certificates, and degrees online from world-class universities and companies.",
    iconName: "Award",
    category: "learning",
    createdAt: new Date("2023-08-01T10:00:00Z"),
    popularity: 84,
  },
  {
    id: "16",
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    description: "A classic book on software development and engineering, offering practical advice.",
    iconName: "BookOpen",
    category: "book",
    createdAt: new Date("2023-08-15T10:00:00Z"),
    popularity: 78,
  },
  {
    id: "17",
    title: "CS50's Introduction to Computer Science",
    author: "Harvard University",
    url: "https://www.youtube.com/watch?v=YoXxevp1WRQ",
    description: "A comprehensive introduction to computer science and programming by Harvard University, available on YouTube.",
    iconName: "Video", // Kept as Video for single video
    category: "youtube",
    createdAt: new Date("2023-09-01T10:00:00Z"),
    popularity: 98,
  },
  {
    id: "18",
    title: "Crash Course Computer Science",
    author: "CrashCourse",
    url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo",
    description: "A YouTube playlist that covers a wide range of computer science topics in an accessible way.",
    iconName: "Youtube", // Changed from ListVideo to Youtube for playlist
    category: "youtube",
    createdAt: new Date("2023-09-10T10:00:00Z"),
    popularity: 99,
  },
  {
    id: "19",
    title: "TensorFlow GitHub Repository",
    author: "Google",
    url: "https://github.com/tensorflow/tensorflow",
    description: "An end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries and community resources.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-10-01T10:00:00Z"),
    popularity: 83,
  },
  {
    id: "20",
    title: "Linux Kernel GitHub Mirror",
    author: "Linus Torvalds & Community",
    url: "https://github.com/torvalds/linux",
    description: "The official mirror of the Linux kernel source tree.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-10-15T10:00:00Z"),
    popularity: 82,
  },
  {
    id: "21",
    title: "Electron GitHub Repository",
    author: "OpenJS Foundation",
    url: "https://github.com/electron/electron",
    description: "Build cross-platform desktop apps with JavaScript, HTML, and CSS.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-11-01T10:00:00Z"),
    popularity: 79,
  },
  {
    id: "22",
    title: "Home Assistant Core GitHub",
    author: "Home Assistant Community",
    url: "https://github.com/home-assistant/core",
    description: "Open source home automation that puts local control and privacy first.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-11-10T10:00:00Z"),
    popularity: 77,
  },
  {
    id: "23",
    title: "Godot Engine GitHub Repository",
    author: "Godot Engine Community",
    url: "https://github.com/godotengine/godot",
    description: "A feature-packed, cross-platform game engine to create 2D and 3D games from a unified interface.",
    iconName: "Github",
    category: "project_repository",
    createdAt: new Date("2023-12-01T10:00:00Z"),
    popularity: 76,
  },
  {
    id: "24",
    title: "EveryCircuit",
    author: "MuseMaze",
    url: "https://everycircuit.com/",
    description: "An online electronics simulator for designing and testing circuits.",
    iconName: "Cpu",
    category: "web",
    createdAt: new Date("2023-12-15T10:00:00Z"),
    popularity: 70,
  },
];


export function addSuggestedLinks(newLinks: SuggestedLink[]) {
  // Use the mutable usefulLinksData array for checking duplicates and adding
  const existingUrls = new Set(usefulLinksData.map(link => link.url));
  let maxId = usefulLinksData.reduce((max, link) => Math.max(max, parseInt(link.id, 10)), 0);

  const addedLinks: UsefulLink[] = [];

  newLinks.forEach(suggestedLink => {
    if (!existingUrls.has(suggestedLink.url)) {
      maxId++;
      const newLinkEntry: UsefulLink = {
        id: maxId.toString(),
        title: suggestedLink.title,
        author: suggestedLink.author,
        url: suggestedLink.url,
        description: suggestedLink.description,
        iconName: mapKeywordsToIcon(suggestedLink.iconKeywords) || "HelpCircle",
        category: suggestedLink.category,
        createdAt: new Date(), // Set current date for new links
        popularity: Math.floor(Math.random() * 50), // Assign a random low popularity for new links
        isNew: true,
      };
      // Directly mutate the exported array
      usefulLinksData.push(newLinkEntry);
      addedLinks.push(newLinkEntry);
      existingUrls.add(suggestedLink.url); // Add to set to prevent adding duplicates from the same suggestion batch
    }
  });
  return addedLinks; // Return the actual links that were added
}

// Helper function to map keywords to a specific Lucide icon name
function mapKeywordsToIcon(keywords?: string): string | undefined {
  if (!keywords) return undefined;
  const lowerKeywords = keywords.toLowerCase();

  if (lowerKeywords.includes("code") || lowerKeywords.includes("repository")) return "Github";
  if (lowerKeywords.includes("playlist")) return "Youtube"; // Youtube icon (brand logo) for playlists
  if (lowerKeywords.includes("video")) return "Video"; // Video icon (camera outline) for single videos
  if (lowerKeywords.includes("book")) return "BookOpen";
  if (lowerKeywords.includes("learn") || lowerKeywords.includes("education")) return "School";
  if (lowerKeywords.includes("tool") || lowerKeywords.includes("utility") || lowerKeywords.includes("web") || lowerKeywords.includes("site") ) return "Globe";
  if (lowerKeywords.includes("circuit") || lowerKeywords.includes("electronic")) return "Cpu";
  return "Link"; // Default icon
}

