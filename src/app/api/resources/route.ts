import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.active = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (type && type !== 'All') {
      query.type = type;
    }

    const resources = await Resource.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ resources });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.description || !body.fileUrl) {
      return NextResponse.json({ error: 'Title, description, and file URL are required' }, { status: 400 });
    }

    await connectToDatabase();
    const resource = await Resource.create(body);

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_RESOURCE',
      entity: 'Resource',
      entityId: resource._id.toString(),
      details: `Added resource: ${resource.title}`,
    });

    return NextResponse.json({ success: true, resource }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create resource' }, { status: 500 });
  }
}
