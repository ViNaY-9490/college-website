import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ContactInquiry } from '@/models/ContactInquiry';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`contact_${ip}`, 5, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot spam trap
    if (body.website_url || body._gotcha) {
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    const { name, email, phone, organization, category, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    await connectToDatabase();

    const inquiry = await ContactInquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      organization: organization?.trim() || '',
      category: category || 'General',
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been successfully transmitted to the E-Cell VITB team.',
        inquiryId: inquiry._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact inquiry error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const query: any = {};
    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;

    const inquiries = await ContactInquiry.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ inquiries });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
