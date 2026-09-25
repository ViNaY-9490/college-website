import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Partner } from '@/models/Partner';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.active = true;
    }
    const partners = await Partner.find(query).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ partners });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Partner name is required' }, { status: 400 });
    }

    await connectToDatabase();
    const partner = await Partner.create({
      ...body,
      logo: body.logo || '/brand/ecell-logo.png',
    });

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_PARTNER',
      entity: 'Partner',
      entityId: partner._id.toString(),
      details: `Added partner: ${partner.name}`,
    });

    return NextResponse.json({ success: true, partner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add partner' }, { status: 500 });
  }
}
