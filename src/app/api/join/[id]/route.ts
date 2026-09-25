import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { JoinApplication } from '@/models/JoinApplication';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function PATCH(
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
    const app = await JoinApplication.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_JOIN_APPLICATION',
      entity: 'JoinApplication',
      entityId: id,
      details: `Updated applicant ${app.name} status to ${app.status}`,
    });

    return NextResponse.json({ success: true, application: app });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update application' }, { status: 500 });
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
    const app = await JoinApplication.findByIdAndDelete(id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Application deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete application' }, { status: 500 });
  }
}
