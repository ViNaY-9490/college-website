import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.active = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    const subCategory = searchParams.get('subCategory');
    if (subCategory && subCategory !== 'All') {
      query.subCategory = subCategory;
    }

    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    await connectToDatabase();
    const item = await GalleryItem.create(body);

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_GALLERY_ITEM',
      entity: 'GalleryItem',
      entityId: item._id.toString(),
      details: `Added gallery item: ${item.title}`,
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create gallery item' }, { status: 500 });
  }
}
