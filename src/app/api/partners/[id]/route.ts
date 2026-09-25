import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Partner } from '@/models/Partner';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();
    const partner = await Partner.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_PARTNER',
      entity: 'Partner',
      entityId: id,
      details: `Updated partner: ${partner.name}`,
    });

    return NextResponse.json({ success: true, partner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update partner' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_PARTNER',
      entity: 'Partner',
      entityId: id,
      details: `Deleted partner: ${partner.name}`,
    });

    return NextResponse.json({ success: true, message: 'Partner deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete partner' }, { status: 500 });
  }
}
