import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { EventRegistration } from '@/models/EventRegistration';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const eventSlug = searchParams.get('eventSlug');
    const status = searchParams.get('status');
    const format = searchParams.get('format'); // 'csv' or 'json'

    const query: any = {};
    if (eventSlug && eventSlug !== 'All') query.eventSlug = eventSlug;
    if (status && status !== 'All') query.status = status;

    const registrations = await EventRegistration.find(query).sort({ createdAt: -1 }).lean();

    if (format === 'csv') {
      const headers = ['Event Title', 'Name', 'Email', 'Phone', 'Institution', 'Department', 'Year', 'Team Name', 'Status', 'Registered At'];
      const rows = registrations.map((r: any) => [
        `"${(r.eventTitle || '').replace(/"/g, '""')}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${r.email || ''}"`,
        `"${r.phone || ''}"`,
        `"${(r.institution || '').replace(/"/g, '""')}"`,
        `"${(r.department || '').replace(/"/g, '""')}"`,
        `"${r.year || ''}"`,
        `"${(r.teamName || '').replace(/"/g, '""')}"`,
        `"${r.status || ''}"`,
        `"${r.createdAt ? new Date(r.createdAt).toISOString() : ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="ecell-registrations-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ registrations });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await EventRegistration.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_REGISTRATION_STATUS',
      entity: 'EventRegistration',
      entityId: id,
      details: `Updated ${updated.name}'s registration status to ${status}`,
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update' }, { status: 500 });
  }
}
