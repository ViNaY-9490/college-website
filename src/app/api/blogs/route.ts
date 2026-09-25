import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import { getSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.status = 'published';
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(query),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json({ error: 'Title, excerpt, and content are required' }, { status: 400 });
    }

    await connectToDatabase();
    const slug = slugify(body.slug || body.title);

    const post = await BlogPost.create({
      ...body,
      slug,
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      author: body.author || {
        name: session.name || 'E-Cell Contributor',
        role: 'Editorial Member',
        avatar: '/brand/ecell-logo.png',
      },
      publishedAt: body.status === 'published' ? new Date() : undefined,
    });

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_BLOG_POST',
      entity: 'BlogPost',
      entityId: post._id.toString(),
      details: `Created blog article: ${post.title}`,
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}
