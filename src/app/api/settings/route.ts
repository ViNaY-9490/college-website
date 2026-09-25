import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { SiteSettings } from '@/models/SiteSettings';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'UPDATE_SITE_SETTINGS',
      entity: 'SiteSettings',
      entityId: settings._id.toString(),
      details: 'Updated site settings (motto, announcement bar, contact info, social links, SEO)',
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
