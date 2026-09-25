import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { BlogPost } from '@/models/BlogPost';
import { Startup } from '@/models/Startup';
import { Initiative } from '@/models/Initiative';
import { Resource } from '@/models/Resource';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        query: q || '',
        results: {
          events: [],
          blogs: [],
          startups: [],
          initiatives: [],
          resources: [],
        },
        totalCount: 0,
      });
    }

    await connectToDatabase();
    const regex = new RegExp(q, 'i');

    const [events, blogs, startups, initiatives, resources] = await Promise.all([
      Event.find({
        status: { $ne: 'draft' },
        $or: [{ title: regex }, { shortDescription: regex }, { category: regex }],
      })
        .select('title slug shortDescription category startDate location coverImage')
        .limit(6)
        .lean(),

      BlogPost.find({
        status: 'published',
        $or: [{ title: regex }, { excerpt: regex }, { tags: regex }, { category: regex }],
      })
        .select('title slug excerpt category coverImage readTime publishedAt')
        .limit(6)
        .lean(),

      Startup.find({
        active: true,
        $or: [{ name: regex }, { tagline: regex }, { category: regex }, { problem: regex }],
      })
        .select('name slug tagline category logo stage')
        .limit(6)
        .lean(),

      Initiative.find({
        active: true,
        $or: [{ title: regex }, { tag: regex }, { shortDescription: regex }],
      })
        .select('title slug tag shortDescription iconName')
        .limit(6)
        .lean(),

      Resource.find({
        active: true,
        $or: [{ title: regex }, { description: regex }, { category: regex }, { type: regex }],
      })
        .select('title description type category fileUrl')
        .limit(6)
        .lean(),
    ]);

    const totalCount =
      events.length + blogs.length + startups.length + initiatives.length + resources.length;

    return NextResponse.json({
      query: q,
      results: {
        events,
        blogs,
        startups,
        initiatives,
        resources,
      },
      totalCount,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to execute search' }, { status: 500 });
  }
}
