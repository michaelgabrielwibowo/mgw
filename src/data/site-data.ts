
import type { SiteProfile, PersonalContact, UsefulLink } from '@/types';
import type { SuggestedLink } from '@/ai/flows/suggest-useful-links-flow';
import { firestore } from '@/lib/firebase-admin'; // Import initialized Firestore instance
import { Timestamp } from 'firebase-admin/firestore';
import { mapKeywordsToIcon } from '@/lib/icon-mapper'; // Move helper to lib

// --- Static Data ---
// Keep static data that might be managed differently (e.g., admin panel later)
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
const usefulLinksCollection = firestore.collection('usefulLinks');

/**
 * Fetches all useful links from Firestore.
 * @returns Promise<UsefulLink[]> Array of useful links.
 */
export async function getUsefulLinks(): Promise<UsefulLink[]> {
  console.log("Attempting to fetch useful links from Firestore...");
  try {
    const snapshot = await usefulLinksCollection.orderBy('createdAt', 'desc').get();
    console.log(`Firestore snapshot received. Empty: ${snapshot.empty}. Size: ${snapshot.size}`);
    if (snapshot.empty) {
      console.log('No useful links found in Firestore.');
      return [];
    }
    const links = snapshot.docs.map(doc => mapDocToUsefulLink(doc));
    console.log(`Successfully fetched and mapped ${links.length} links.`);
    return links;
  } catch (error: any) {
    // Log essential error details concisely
    console.error(`Error fetching useful links: Code=${error.code}, Message=${error.message}`);
    if (error.message?.includes('Getting metadata from plugin failed')) {
        console.warn("Firebase ADC Hint: This often indicates an issue with Firebase Admin SDK authentication.");
        console.warn("Ensure Application Default Credentials (ADC) are configured correctly (run `gcloud auth application-default login` and check Firestore permissions).");
    }
    // console.error("Full error stack:", error.stack); // Optionally log stack for deeper debugging
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
        console.error(`Error fetching existing URLs: ${error.message}`);
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
            console.error(`Error committing batch add to Firestore: ${error.message}`);
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
    console.error(`Error resetting 'isNew' flag: ${error.message}`);
  }
}

// Example function to seed initial data if the collection is empty
// async function seedInitialLinks() {
//   const initialLinks: Omit<UsefulLink, 'id' | 'createdAt' | 'isNew'>[] = [
//      {
//         title: "NotebookLM",
//         author: "Google",
//         url: "https://notebooklm.google.com/",
//         description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
//         iconName: "Lightbulb",
//         category: "web",
//         popularity: 85,
//       },
//       {
//         title: "OpenStax",
//         author: "Rice University",
//         url: "https://openstax.org/",
//         description: "Access free, peer-reviewed, openly licensed textbooks for college and AP courses.",
//         iconName: "BookOpenCheck",
//         category: "learning",
//         popularity: 90,
//       },
//       // ... add other initial links ...
//   ];
//   const batch = firestore.batch();
//   const now = Timestamp.now();
//   initialLinks.forEach(link => {
//     const docRef = usefulLinksCollection.doc(); // Auto-generate ID
//     batch.set(docRef, {
//       ...link,
//       createdAt: now, // Set current timestamp for all seeded links
//       isNew: false, // Seeded links are not 'new'
//     });
//   });
//   try {
//     await batch.commit();
//     console.log(`Seeded ${initialLinks.length} initial links.`);
//   } catch (error) {
//     console.error("Error seeding initial links:", error);
//   }
// }
