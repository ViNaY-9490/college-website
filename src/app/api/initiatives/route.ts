import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Initiative } from '@/models/Initiative';
import { getSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.active = true;
    }
    const initiatives = await Initiative.find(query).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ initiatives });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch initiatives' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.shortDescription || !body.description) {
      return NextResponse.json({ error: 'Title, short description, and description are required' }, { status: 400 });
    }

    await connectToDatabase();
    const slug = slugify(body.slug || body.title);

    const initiative = await Initiative.create({
      ...body,
      slug,
      tag: body.tag || 'Initiative',
    });

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_INITIATIVE',
      entity: 'Initiative',
      entityId: initiative._id.toString(),
      details: `Created initiative: ${initiative.title}`,
    });

    return NextResponse.json({ success: true, initiative }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create initiative' }, { status: 500 });
  }
}
