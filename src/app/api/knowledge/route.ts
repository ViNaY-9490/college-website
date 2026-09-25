import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { KnowledgeItem } from '@/models/KnowledgeItem';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: any = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await KnowledgeItem.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch knowledge items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, content, source, tags, active, order } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and Content are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const item = await KnowledgeItem.create({
      title: title.trim(),
      category: category || 'Custom',
      content: content.trim(),
      source: source || 'Admin Manual Entry',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      active: active ?? true,
      order: order || 0,
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create knowledge item' }, { status: 500 });
  }
}
