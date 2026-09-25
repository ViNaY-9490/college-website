import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { EventRegistration } from '@/models/EventRegistration';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`register_${ip}`, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const { slug } = await params;
    const body = await req.json();

    // Honeypot spam trap
    if (body.website_url || body._honey) {
      // Silently accept bots to waste their time
      return NextResponse.json({ success: true, message: 'Registration recorded.' });
    }

    const { name, email, phone, institution, department, year, teamName, remarks } = body;

    if (!name || !email || !phone || !institution || !department || !year) {
      return NextResponse.json(
        { error: 'Please provide all required fields (Name, Email, Phone, College/Institution, Department, Year).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    await connectToDatabase();

    const event = await Event.findOne({ slug });
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    if (event.status !== 'registration_open' && event.status !== 'upcoming') {
      return NextResponse.json(
        { error: `Registrations are currently closed for this event (Status: ${event.status}).` },
        { status: 400 }
      );
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return NextResponse.json(
        { error: 'The registration deadline for this event has passed.' },
        { status: 400 }
      );
    }

    // Check duplicate
    const cleanEmail = email.toLowerCase().trim();
    const existingRegistration = await EventRegistration.findOne({
      eventId: event._id,
      email: cleanEmail,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this event with this email address.' },
        { status: 409 }
      );
    }

    // Capacity check
    const currentCount = await EventRegistration.countDocuments({
      eventId: event._id,
      status: { $in: ['confirmed', 'attended'] },
    });

    let regStatus: 'confirmed' | 'waitlisted' = 'confirmed';
    if (event.capacity && currentCount >= event.capacity) {
      regStatus = 'waitlisted';
    }

    const registration = await EventRegistration.create({
      eventId: event._id,
      eventSlug: event.slug,
      eventTitle: event.title,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      institution: institution.trim(),
      department: department.trim(),
      year,
      teamName: teamName?.trim() || '',
      remarks: remarks?.trim() || '',
      status: regStatus,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          regStatus === 'confirmed'
            ? 'Registration confirmed! A confirmation record has been generated.'
            : 'Event has reached standard capacity. You have been placed on the priority waitlist.',
        registration: {
          id: registration._id,
          eventTitle: event.title,
          name: registration.name,
          email: registration.email,
          status: registration.status,
          registeredAt: registration.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You are already registered for this event with this email.' },
        { status: 409 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
