import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const post = await BlogPost.findOne({ slug }).lean();
    if (!post) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Related posts
    const relatedPosts = await BlogPost.find({
      _id: { $ne: (post as any)._id },
      category: (post as any).category,
      status: 'published',
    })
      .limit(3)
      .select('title slug excerpt coverImage readTime publishedAt')
      .lean();

    return NextResponse.json({ post, relatedPosts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();

    await connectToDatabase();
    const post = await BlogPost.findOneAndUpdate({ slug }, { $set: body }, { new: true });
    if (!post) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_BLOG_POST',
      entity: 'BlogPost',
      entityId: post._id.toString(),
      details: `Updated blog post: ${post.title}`,
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    await connectToDatabase();
    const post = await BlogPost.findOneAndDelete({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_BLOG_POST',
      entity: 'BlogPost',
      entityId: post._id.toString(),
      details: `Deleted blog post: ${post.title}`,
    });

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete article' }, { status: 500 });
  }
}
