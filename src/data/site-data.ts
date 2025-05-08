
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
  try {
    const snapshot = await usefulLinksCollection.orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      console.log('No useful links found in Firestore.');
      // Optionally seed initial data if collection is empty
      // await seedInitialLinks();
      // const seededSnapshot = await usefulLinksCollection.orderBy('createdAt', 'desc').get();
      // return seededSnapshot.docs.map(doc => mapDocToUsefulLink(doc));
      return [];
    }
    return snapshot.docs.map(doc => mapDocToUsefulLink(doc));
  } catch (error) {
    console.error("Error fetching useful links from Firestore:", error);
    return []; // Return empty array on error
  }
}

/**
 * Adds suggested links to Firestore if they don't already exist (based on URL).
 * @param newLinks Array of suggested links from the AI flow.
 * @returns Promise<UsefulLink[]> Array of links that were actually added.
 */
export async function addSuggestedLinks(newLinks: SuggestedLink[]): Promise<UsefulLink[]> {
    const addedLinks: UsefulLink[] = [];
    const batch = firestore.batch();
    let newDocsCount = 0;

    // Get all existing URLs in one go to minimize reads
    const existingUrls = new Set<string>();
    try {
        const existingSnapshot = await usefulLinksCollection.select('url').get();
        existingSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.url) {
            existingUrls.add(data.url);
          }
        });
    } catch (error) {
        console.error("Error fetching existing URLs:", error);
        // Decide if we should proceed or return an error
        return []; // Fail safely
    }


    for (const suggestedLink of newLinks) {
      if (!existingUrls.has(suggestedLink.url)) {
        const newLinkRef = usefulLinksCollection.doc(); // Auto-generate ID
        const newLinkEntry: Omit<UsefulLink, 'id'> & { createdAt: Timestamp } = {
          title: suggestedLink.title,
          author: suggestedLink.author,
          url: suggestedLink.url,
          description: suggestedLink.description,
          iconName: mapKeywordsToIcon(suggestedLink.iconKeywords) || "HelpCircle",
          category: suggestedLink.category,
          createdAt: Timestamp.now(), // Use Firestore Timestamp
          popularity: Math.floor(Math.random() * 50),
          isNew: true, // Mark as new
        };
        batch.set(newLinkRef, newLinkEntry);
        addedLinks.push({ ...newLinkEntry, id: newLinkRef.id, createdAt: newLinkEntry.createdAt.toDate() }); // Add to return array with JS Date
        existingUrls.add(suggestedLink.url); // Prevent adding duplicates from the same batch
        newDocsCount++;
      }
    }

    if (newDocsCount > 0) {
        try {
            await batch.commit();
            console.log(`Successfully added ${newDocsCount} new links to Firestore.`);
            // Optionally reset the 'isNew' flag for older links here if needed
            // await resetIsNewFlag();
        } catch (error) {
            console.error("Error committing batch add to Firestore:", error);
            return []; // Return empty array on commit error
        }
    } else {
        console.log("No new unique links to add.");
    }

    return addedLinks;
}

// Helper function to map Firestore doc to UsefulLink type
function mapDocToUsefulLink(doc: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): UsefulLink {
  const data = doc.data() as any; // Use any temporarily for easier mapping
  return {
    id: doc.id,
    title: data.title || 'Untitled',
    author: data.author,
    url: data.url || '#',
    description: data.description,
    iconName: data.iconName || 'HelpCircle',
    category: data.category,
    // Convert Firestore Timestamp to JS Date
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    popularity: data.popularity || 0,
    isNew: data.isNew === true, // Explicitly check for true
  };
}

// --- Optional: Seeding and Flag Reset ---

// Example function to reset the 'isNew' flag for all links (could be run periodically)
// export async function resetIsNewFlag() {
//   try {
//     const snapshot = await usefulLinksCollection.where('isNew', '==', true).get();
//     if (snapshot.empty) return;

//     const batch = firestore.batch();
//     snapshot.docs.forEach(doc => {
//       batch.update(doc.ref, { isNew: false });
//     });
//     await batch.commit();
//     console.log(`Reset 'isNew' flag for ${snapshot.size} links.`);
//   } catch (error) {
//     console.error("Error resetting 'isNew' flag:", error);
//   }
// }

// Example function to seed initial data if the collection is empty
// async function seedInitialLinks() {
//   const initialLinks = [
//      // ... (your initial link objects here, ensure createdAt is a Date) ...
//        {
//         id: "1", // Firestore will auto-generate IDs, this is just for the example structure
//         title: "NotebookLM",
//         author: "Google",
//         url: "https://notebooklm.google.com/",
//         description: "An AI-powered research and writing assistant to help you synthesize information and generate insights.",
//         iconName: "Lightbulb",
//         category: "web",
//         createdAt: new Date("2023-01-01T10:00:00Z"),
//         popularity: 85,
//         isNew: false,
//       },
//       // ... add other initial links ...
//   ];
//   const batch = firestore.batch();
//   initialLinks.forEach(link => {
//     const { id, ...linkData } = link; // Exclude ID if using auto-generated ones
//     const docRef = usefulLinksCollection.doc(); // Auto-generate ID
//     batch.set(docRef, {
//       ...linkData,
//       createdAt: Timestamp.fromDate(linkData.createdAt), // Convert Date to Timestamp
//     });
//   });
//   try {
//     await batch.commit();
//     console.log(`Seeded ${initialLinks.length} initial links.`);
//   } catch (error) {
//     console.error("Error seeding initial links:", error);
//   }
// }
