
import type { SiteProfile, PersonalContact, UsefulLink } from '@/types';
import type { SuggestedLink } from '@/ai/flows/suggest-useful-links-flow';
import { firestore } from '@/lib/firebase-admin'; // Import potentially initialized Firestore instance
import { Timestamp } from 'firebase-admin/firestore';
import { mapKeywordsToIcon } from '@/lib/icon-mapper'; // Move helper to lib

// --- Static Data ---
export const siteProfileData: SiteProfile = {
  siteTitle: 'PersonaLink | Michael Gabriel Wibowo | Personal Page',
  metaDescriptionName: 'Michael Gabriel Wibowo',
  profileName: 'Michael Gabriel Wibowo',
  tagline: 'International Student from Indonesia at Tunghai University, Taiwan',
  profilePictureUrl: '/my image.jpg', // Use local image
  footerName: 'Michael Gabriel Wibowo',
};

export const personalContactsData: PersonalContact[] = [
  { id: "2", title: "LinkedIn", value: "Michael Gabriel Wibowo", url: "https://www.linkedin.com/in/michael-gabriel-wibowo", iconName: "Linkedin" },
  { id: "1", title: "Email", value: "michaelgabrielwibowo@gmail.com", url: "mailto:michaelgabrielwibowo@gmail.com", iconName: "Mail" },
  { id: "4", title: "WhatsApp", value: "+(886) 936-147-487", url: "https://wa.me/qr/SN33DTMONLEIM1", iconName: "Whatsapp" },
];


// --- Firestore Interaction for Useful Links ---

let usefulLinksCollection: FirebaseFirestore.CollectionReference | null = null;
if (firestore) { // Check if firestore instance was successfully initialized
    usefulLinksCollection = firestore.collection('usefulLinks');
} else {
    console.error("Firestore instance is not available (initialization failed or permissions issue). Useful links functionality will be disabled. Check 'src/lib/firebase-admin.ts' logs.");
}


/**
 * Fetches all useful links from Firestore.
 * @returns Promise<UsefulLink[]> Array of useful links.
 */
export async function getUsefulLinks(): Promise<UsefulLink[]> {
  if (!usefulLinksCollection) {
      console.warn("Firestore collection is not available. Returning empty array.");
      return [];
  }
  try {
    const snapshot = await usefulLinksCollection.orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      console.log('No useful links found in Firestore.');
      // Optionally seed initial data if collection is empty
      // await seedInitialLinks(); // Call seeding if needed, but be cautious
      return [];
    }
    return snapshot.docs.map(doc => mapDocToUsefulLink(doc));
  } catch (error: any) {
    // Log essential error details concisely
    console.error(`Error fetching useful links: Code=${error.code}, Message=${error.message}`);
    if (error.message?.includes('Getting metadata from plugin failed') || error.message?.includes('Could not refresh access token')) {
        console.warn("Firebase ADC Hint: This often indicates an issue with Firebase Admin SDK authentication or permissions.");
        console.warn("Check the Firebase Admin initialization logs and ensure Application Default Credentials (ADC) are configured correctly (run `gcloud auth application-default login`, `gcloud config set project YOUR_PROJECT_ID`, and check IAM permissions).");
    } else if (error.code === 7) { // Firestore permission denied
       console.warn("Firebase Permission Denied: Check Firestore security rules and the IAM permissions of the service account/user running the application.");
    }
    return []; // Return empty array on error
  }
}


/**
 * Adds suggested links to Firestore if they don't already exist (based on URL).
 * Marks newly added links with isNew = true.
 * @param newLinks Array of suggested links from the AI flow.
 * @returns Promise<UsefulLink[]> Array of links that were actually added (with JS Date).
 */
export async function addSuggestedLinks(newLinks: SuggestedLink[]): Promise<UsefulLink[]> {
    if (!usefulLinksCollection || !firestore) { // Added check for firestore for batch
      console.warn("Attempted to add suggested links, but Firestore is not available.");
      return [];
    }

    const addedLinks: UsefulLink[] = [];
    const batch = firestore.batch();
    let newDocsCount = 0;

    // Get all existing URLs in one go to minimize reads
    const existingUrls = new Set<string>();
    try {
        console.log("Fetching existing URLs to prevent duplicates...");
        const existingSnapshot = await usefulLinksCollection.select('url').get();
        existingSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.url) {
            existingUrls.add(data.url);
          }
        });
        console.log(`Found ${existingUrls.size} existing URLs.`);
    } catch (error: any) {
        console.error(`Error fetching existing URLs: ${error.message}. Check Firestore permissions/ADC setup (see firebase-admin.ts logs).`);
        return []; // Fail safely
    }


    for (const suggestedLink of newLinks) {
      if (!existingUrls.has(suggestedLink.url)) {
        const newLinkRef = usefulLinksCollection.doc(); // Auto-generate ID
        const newLinkEntry: Omit<UsefulLink, 'id' | 'createdAt'> & { createdAt: Timestamp } = { // Expect Timestamp for Firestore
          title: suggestedLink.title,
          author: suggestedLink.author,
          url: suggestedLink.url,
          description: suggestedLink.description,
          iconName: mapKeywordsToIcon(suggestedLink.iconKeywords) || "HelpCircle",
          category: suggestedLink.category,
          createdAt: Timestamp.now(), // Use Firestore Timestamp for writing
          popularity: Math.floor(Math.random() * 50), // Example popularity
          isNew: true, // Mark as new
        };
        batch.set(newLinkRef, newLinkEntry);
        // Prepare the object for the return array (convert Timestamp to JS Date)
        addedLinks.push({
            ...newLinkEntry,
            id: newLinkRef.id,
            createdAt: newLinkEntry.createdAt.toDate() // Convert to Date for client/app use
        });
        existingUrls.add(suggestedLink.url); // Prevent adding duplicates from the same batch
        newDocsCount++;
        console.log(`Prepared new link for batch: ${suggestedLink.title}`);
      } else {
         console.log(`Skipping duplicate link: ${suggestedLink.title} (${suggestedLink.url})`);
      }
    }

    if (newDocsCount > 0) {
        try {
            console.log(`Committing batch with ${newDocsCount} new links...`);
            await batch.commit();
            console.log(`Successfully added ${newDocsCount} new links to Firestore.`);
            // Optionally reset the 'isNew' flag for older links here if needed
            // await resetIsNewFlag(); // Make sure this function exists and is imported if uncommented
        } catch (error: any) {
            console.error(`Error committing batch add to Firestore: ${error.message}. Check Firestore permissions/ADC setup (see firebase-admin.ts logs).`);
            return []; // Return empty array on commit error
        }
    } else {
        console.log("No new unique links to add.");
    }

    return addedLinks; // Return the array of links that were successfully added (with JS Date)
}


// Helper function to map Firestore doc to UsefulLink type
function mapDocToUsefulLink(doc: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): UsefulLink {
  const data = doc.data() as any; // Use any temporarily for easier mapping
  // Safely convert Firestore Timestamp to JS Date
   const createdAtDate = data.createdAt instanceof Timestamp
       ? data.createdAt.toDate()
       : (data.createdAt && typeof data.createdAt.toDate === 'function' // Handle potential object format if not Timestamp instance
          ? data.createdAt.toDate()
          : new Date()); // Fallback to current date if invalid

  return {
    id: doc.id,
    title: data.title || 'Untitled',
    author: data.author,
    url: data.url || '#',
    description: data.description,
    iconName: data.iconName || 'HelpCircle', // Provide default icon
    category: data.category || 'web', // Provide default category
    createdAt: createdAtDate,
    popularity: data.popularity || 0,
    isNew: data.isNew === true, // Explicitly check for true
  };
}


// --- Optional: Seeding and Flag Reset ---

// Example function to reset the 'isNew' flag for all links (could be run periodically)
export async function resetIsNewFlag() {
  if (!usefulLinksCollection || !firestore) {
      console.warn("Attempted to reset 'isNew' flag, but Firestore is not available.");
      return;
  }
  console.log("Attempting to reset 'isNew' flag for older links...");
  try {
    const snapshot = await usefulLinksCollection.where('isNew', '==', true).get();
    if (snapshot.empty) {
        console.log("No links found with isNew=true flag.");
        return;
    };

    const batch = firestore.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isNew: false });
    });
    await batch.commit();
    console.log(`Reset 'isNew' flag for ${snapshot.size} links.`);
  } catch (error: any) {
    console.error(`Error resetting 'isNew' flag: ${error.message}. Check Firestore permissions/ADC setup (see firebase-admin.ts logs).`);
  }
}

// Example function to seed initial data if the collection is empty
async function seedInitialLinks() {
  if (!usefulLinksCollection || !firestore) {
    console.warn("Firestore not available, cannot seed initial links.");
    return;
  }
  const initialLinks: Omit<UsefulLink, 'id' | 'createdAt' | 'isNew'>[] = [
     {
        title: "NotebookLM",
        author: "Google",
        url: "https://notebooklm.google.com/",
        description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
        iconName: "Lightbulb",
        category: "web", // Changed from 'tool' to 'web'
        popularity: 85,
      },
      {
        title: "OpenStax",
        author: "Rice University",
        url: "https://openstax.org/",
        description: "Access free, peer-reviewed, openly licensed textbooks for college and AP courses.",
        iconName: "BookOpenCheck",
        category: "learning",
        popularity: 90,
      },
      {
          title: "Khan Academy",
          author: "Khan Academy",
          url: "https://www.khanacademy.org/",
          description: "Offers practice exercises, instructional videos, and a personalized learning dashboard.",
          iconName: "Users",
          category: "learning",
          popularity: 95,
      },
      {
          title: "Project Gutenberg",
          author: "Various Volunteers",
          url: "https://www.gutenberg.org/",
          description: "A library of over 70,000 free eBooks, with a focus on older works for which U.S. copyright has expired.",
          iconName: "BookOpen", // Changed from FileText
          category: "book",
          popularity: 80,
      },
      {
          title: "MIT OpenCourseWare",
          author: "MIT",
          url: "https://ocw.mit.edu/",
          description: "A web-based publication of virtually all MIT course content, open and available to the world.",
          iconName: "Landmark",
          category: "learning",
          popularity: 88,
      },
      {
          title: "Next.js Documentation",
          author: "Vercel",
          url: "https://nextjs.org/docs",
          description: "The official documentation for Next.js, a React framework for PWA.",
          iconName: "BookMarked",
          category: "web",
          popularity: 92,
      },
       {
          title: "Tailwind CSS",
          author: "Tailwind Labs",
          url: "https://tailwindcss.com/docs",
          description: "A utility-first CSS framework for rapid UI development.",
          iconName: "Code", // Assuming Code icon fits
          category: "web",
          popularity: 89,
      },
      {
          title: "Shadcn/ui",
          url: "https://ui.shadcn.com/",
          description: "Beautifully designed components that you can copy and paste into your apps.",
          iconName: "Cpu", // Placeholder icon
          category: "web",
          popularity: 93,
      },
       {
          title: "Genkit GitHub Repository",
          author: "Google",
          url: "https://github.com/firebase/genkit",
          description: "The official GitHub repository for Genkit, a toolkit for building AI-powered applications.",
          iconName: "Github",
          category: "project_repository",
          popularity: 75,
      },
      {
          title: "Mozilla Developer Network (MDN)",
          author: "Mozilla",
          url: "https://developer.mozilla.org/",
          description: "Comprehensive documentation for web standards and technologies.",
          iconName: "Globe",
          category: "web",
          popularity: 96,
      },
      {
          title: "React Official Website",
          author: "Meta",
          url: "https://react.dev/",
          description: "The official website for React, a JavaScript library for building user interfaces.",
          iconName: "Globe", // or a specific React icon if available
          category: "web",
          popularity: 94,
      },
      {
          title: "VS Code GitHub Repository",
          author: "Microsoft",
          url: "https://github.com/microsoft/vscode",
          description: "The GitHub repository for Visual Studio Code, a popular open-source code editor.",
          iconName: "Github",
          category: "project_repository",
          popularity: 98,
      },
       {
          title: "freeCodeCamp",
          author: "freeCodeCamp.org",
          url: "https://www.freecodecamp.org/",
          description: "Learn to code for free. Build projects. Earn certifications.",
          iconName: "School",
          category: "learning",
          popularity: 91,
      },
      {
          title: "edX",
          author: "2U",
          url: "https://www.edx.org/",
          description: "Access 2000 free online courses from 140 leading institutions worldwide.",
          iconName: "School",
          category: "learning",
          popularity: 87,
      },
      {
          title: "Coursera",
          author: "Coursera Inc.",
          url: "https://www.coursera.org/",
          description: "Build skills with courses, certificates, and degrees online from world-class universities and companies.",
          iconName: "Award",
          category: "learning",
          popularity: 86,
      },
      {
          title: "The Pragmatic Programmer",
          author: "David Thomas, Andrew Hunt",
          url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
          description: "A classic book on software development and engineering, offering practical advice.",
          iconName: "BookOpen",
          category: "book",
          popularity: 82,
      },
       {
          title: "CS50's Introduction to Computer Science",
          author: "Harvard University",
          url: "https://www.youtube.com/playlist?list=PLhQjrBD2T382_R182iC2gNZI9HzjMjhd0", // Example Playlist URL
          description: "A comprehensive introduction to computer science and programming by Harvard University, available on YouTube.",
          iconName: "Youtube", // Use Youtube icon for playlist
          category: "youtube",
          popularity: 90,
      },
      {
          title: "Crash Course Computer Science",
          author: "CrashCourse",
          url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo", // Example Playlist URL
          description: "A YouTube playlist that covers a wide range of computer science topics in an accessible way.",
          iconName: "Youtube", // Use Youtube icon for playlist
          category: "youtube",
          popularity: 85,
      },
      {
          title: "TensorFlow GitHub Repository",
          author: "Google",
          url: "https://github.com/tensorflow/tensorflow",
          description: "An end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries and community resources.",
          iconName: "Github",
          category: "project_repository",
          popularity: 88,
      },
      {
          title: "Linux Kernel GitHub Mirror",
          author: "Linus Torvalds & Community",
          url: "https://github.com/torvalds/linux",
          description: "The official mirror of the Linux kernel source tree.",
          iconName: "Github",
          category: "project_repository",
          popularity: 95,
      },
      {
          title: "Electron GitHub Repository",
          author: "OpenJS Foundation",
          url: "https://github.com/electron/electron",
          description: "Build cross-platform desktop apps with JavaScript, HTML, and CSS.",
          iconName: "Github",
          category: "project_repository",
          popularity: 84,
      },
      {
          title: "Home Assistant Core GitHub",
          author: "Home Assistant Community",
          url: "https://github.com/home-assistant/core",
          description: "Open source home automation that puts local control and privacy first.",
          iconName: "Github",
          category: "project_repository",
          popularity: 81,
      },
      {
          title: "Godot Engine GitHub Repository",
          author: "Godot Engine Community",
          url: "https://github.com/godotengine/godot",
          description: "A feature-packed, cross-platform game engine to create 2D and 3D games from a unified interface.",
          iconName: "Github",
          category: "project_repository",
          popularity: 83,
      },
      {
        title: "EveryCircuit",
        author: "MuseMaze",
        url: "https://everycircuit.com/",
        description: "An online electronics simulator for designing and testing circuits.",
        iconName: "Cpu", // Or a more specific icon if available
        category: "web", // Categorized as a web tool
        popularity: 78,
      },
  ];
  const batch = firestore.batch();
  const now = Timestamp.now();

  // Get existing URLs to avoid adding duplicates during seeding
  const existingUrls = new Set<string>();
  try {
      const existingSnapshot = await usefulLinksCollection.select('url').get();
      existingSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.url) {
          existingUrls.add(data.url);
        }
      });
  } catch (error: any) {
      console.error(`Error fetching existing URLs during seeding: ${error.message}`);
      // Decide if you want to proceed without checking duplicates or stop seeding
      return;
  }

  let seededCount = 0;
  initialLinks.forEach(link => {
    if (!existingUrls.has(link.url)) {
      const docRef = usefulLinksCollection!.doc(); // Use non-null assertion as checked above
      batch.set(docRef, {
        ...link,
        createdAt: now, // Set current timestamp for all seeded links
        isNew: false, // Seeded links are not 'new'
      });
      seededCount++;
    } else {
        console.log(`Skipping duplicate during seed: ${link.title}`);
    }
  });
  try {
    if (seededCount > 0) {
        await batch.commit();
        console.log(`Seeded ${seededCount} initial unique links.`);
    } else {
        console.log("No new unique links to seed.");
    }
  } catch (error) {
    console.error("Error committing seed batch:", error);
  }
}

// Call seeding function potentially after checking if collection is empty in getUsefulLinks or on app startup
// Consider calling this only once or based on a specific condition
// seedInitialLinks(); // Commented out to prevent running on every build/reload
