import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Startup } from '@/models/Startup';
import { getSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const stage = searchParams.get('stage');

    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.active = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (stage && stage !== 'All') {
      query.stage = stage;
    }

    const startups = await Startup.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ startups });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.tagline || !body.problem || !body.solution || !body.category) {
      return NextResponse.json({ error: 'Missing required startup fields' }, { status: 400 });
    }

    await connectToDatabase();
    const slug = slugify(body.slug || body.name);

    const startup = await Startup.create({
      ...body,
      slug,
      logo: body.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    });

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_STARTUP',
      entity: 'Startup',
      entityId: startup._id.toString(),
      details: `Added startup: ${startup.name}`,
    });

    return NextResponse.json({ success: true, startup }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create startup' }, { status: 500 });
  }
}
