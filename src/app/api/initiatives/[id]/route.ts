import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Initiative } from '@/models/Initiative';
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
    const initiative = await Initiative.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!initiative) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_INITIATIVE',
      entity: 'Initiative',
      entityId: id,
      details: `Updated initiative: ${initiative.title}`,
    });

    return NextResponse.json({ success: true, initiative });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update initiative' }, { status: 500 });
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
    const initiative = await Initiative.findByIdAndDelete(id);
    if (!initiative) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_INITIATIVE',
      entity: 'Initiative',
      entityId: id,
      details: `Deleted initiative: ${initiative.title}`,
    });

    return NextResponse.json({ success: true, message: 'Initiative deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete initiative' }, { status: 500 });
  }
}
