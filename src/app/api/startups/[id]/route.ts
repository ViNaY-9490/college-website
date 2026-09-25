import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Startup } from '@/models/Startup';
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
    const startup = await Startup.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_STARTUP',
      entity: 'Startup',
      entityId: id,
      details: `Updated startup: ${startup.name}`,
    });

    return NextResponse.json({ success: true, startup });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update startup' }, { status: 500 });
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
    const startup = await Startup.findByIdAndDelete(id);
    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'DELETE_STARTUP',
      entity: 'Startup',
      entityId: id,
      details: `Deleted startup: ${startup.name}`,
    });

    return NextResponse.json({ success: true, message: 'Startup deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete startup' }, { status: 500 });
  }
}
