import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`newsletter_${ip}`, 5, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many newsletter requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();
        return NextResponse.json({ success: true, message: 'Welcome back! Your newsletter subscription is re-activated.' });
      }
      return NextResponse.json({ success: true, message: 'You are already subscribed to the E-Cell newsletter.' });
    }

    await NewsletterSubscriber.create({
      email: cleanEmail,
      status: 'active',
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Subscribed successfully! You will receive upcoming entrepreneurship updates and event invites.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: true, message: 'You are already subscribed to the E-Cell newsletter.' });
    }
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 }).lean();
    return NextResponse.json({ subscribers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
