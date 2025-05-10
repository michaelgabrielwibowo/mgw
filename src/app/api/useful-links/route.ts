import { NextRequest, NextResponse } from 'next/server';
import { getUsefulLinks, addSuggestedLinks } from '@/data/site-data';

// GET: Fetch all useful links
export async function GET() {
  try {
    const links = await getUsefulLinks();
    return NextResponse.json({ links });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links.' }, { status: 500 });
  }
}

// POST: Add suggested links
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { suggestedLinks } = body;
    if (!Array.isArray(suggestedLinks)) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }
    const added = await addSuggestedLinks(suggestedLinks);
    return NextResponse.json({ added });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add links.' }, { status: 500 });
  }
}
