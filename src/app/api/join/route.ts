import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { JoinApplication } from '@/models/JoinApplication';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { getSessionFromRequest } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`join_${ip}`, 5, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before attempting another submission.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Spam honeypot trap
    if (body.website_url || body._security_token_trap) {
      return NextResponse.json({ success: true, message: 'Application submitted.' });
    }

    const {
      name,
      email,
      phone,
      rollNumber,
      department,
      year,
      primaryDomain,
      secondaryDomain,
      whyJoin,
      priorExperience,
      portfolioUrl,
    } = body;

    if (!name || !email || !phone || !rollNumber || !department || !year || !primaryDomain || !whyJoin) {
      return NextResponse.json(
        { error: 'Please fill in all mandatory application fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    await connectToDatabase();

    const cleanEmail = email.toLowerCase().trim();
    const existing = await JoinApplication.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'An application has already been submitted under this email address.' },
        { status: 409 }
      );
    }

    const application = await JoinApplication.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      department: department.trim(),
      year,
      roleApplied: body.roleApplied || 'Associate',
      primaryDomain,
      secondaryDomain: secondaryDomain || '',
      whyJoin: whyJoin.trim(),
      priorExperience: priorExperience?.trim() || '',
      portfolioUrl: portfolioUrl?.trim() || '',
      weeklyCommitment: body.weeklyCommitment || '5-10 hrs/week',
      roleSpecificAnswers: body.roleSpecificAnswers || {},
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application to join E-Cell VITB has been recorded successfully. Our recruitment team will review your profile.',
        applicationId: application._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An application has already been submitted under this email address.' },
        { status: 409 }
      );
    }
    console.error('Join application error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
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
    const domain = searchParams.get('domain');
    const status = searchParams.get('status');

    const query: any = {};
    if (domain && domain !== 'All') query.primaryDomain = domain;
    if (status && status !== 'All') query.status = status;

    const applications = await JoinApplication.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ applications });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
