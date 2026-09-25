import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { EventRegistration } from '@/models/EventRegistration';
import { JoinApplication } from '@/models/JoinApplication';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { ContactInquiry } from '@/models/ContactInquiry';
import { Event } from '@/models/Event';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const format = searchParams.get('format'); // 'csv' or 'json'
    const sourceFilter = searchParams.get('source') || 'All'; // 'All' | 'Event' | 'Join' | 'Newsletter' | 'Contact'

    // Fetch all collections in parallel
    const [events, eventRegs, joinApps, subscribers, inquiries] = await Promise.all([
      Event.find({}).select('title slug category startDate status').lean(),
      EventRegistration.find({}).sort({ createdAt: -1 }).lean(),
      JoinApplication.find({}).sort({ createdAt: -1 }).lean(),
      NewsletterSubscriber.find({}).sort({ createdAt: -1 }).lean(),
      ContactInquiry.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    // 1. Build Event-Wise Classification Buckets
    // Map event slug to details
    const eventMap = new Map<string, any>();
    for (const ev of events) {
      eventMap.set(ev.slug, {
        slug: ev.slug,
        title: ev.title,
        category: ev.category,
        status: ev.status,
        startDate: ev.startDate,
        totalCount: 0,
        confirmedCount: 0,
        waitlistedCount: 0,
        attendedCount: 0,
        uniqueEmails: new Set<string>(),
        attendees: [],
      });
    }

    // Populate event buckets
    for (const reg of eventRegs) {
      let bucket = eventMap.get(reg.eventSlug);
      if (!bucket) {
        bucket = {
          slug: reg.eventSlug,
          title: reg.eventTitle || reg.eventSlug,
          category: 'Other',
          status: 'active',
          totalCount: 0,
          confirmedCount: 0,
          waitlistedCount: 0,
          attendedCount: 0,
          uniqueEmails: new Set<string>(),
          attendees: [],
        };
        eventMap.set(reg.eventSlug, bucket);
      }

      bucket.totalCount += 1;
      if (reg.status === 'confirmed') bucket.confirmedCount += 1;
      else if (reg.status === 'waitlisted') bucket.waitlistedCount += 1;
      else if (reg.status === 'attended') bucket.attendedCount += 1;

      if (reg.email) {
        bucket.uniqueEmails.add(reg.email.toLowerCase().trim());
      }

      bucket.attendees.push({
        _id: reg._id,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        institution: reg.institution,
        department: reg.department,
        year: reg.year,
        teamName: reg.teamName,
        status: reg.status,
        createdAt: reg.createdAt,
      });
    }

    // Convert Set of emails to Array for JSON serialization
    const eventWiseBuckets = Array.from(eventMap.values())
      .filter((b) => b.totalCount > 0 || events.some((e) => e.slug === b.slug))
      .map((b) => ({
        ...b,
        uniqueEmailsCount: b.uniqueEmails.size,
        uniqueEmails: Array.from(b.uniqueEmails),
      }))
      .sort((a, b) => b.totalCount - a.totalCount);

    // 2. Build Unified "All Emails & Contacts" Master Directory (deduplicated by email)
    interface UnifiedContact {
      email: string;
      name: string;
      phone: string;
      sources: string[];
      primaryCategory: string;
      tags: string[];
      details: string;
      lastActive: Date | string;
    }

    const contactMap = new Map<string, UnifiedContact>();

    // Add event attendees
    for (const r of eventRegs) {
      const email = (r.email || '').toLowerCase().trim();
      if (!email) continue;

      const existing = contactMap.get(email);
      const eventTag = `Event: ${r.eventTitle || r.eventSlug}`;
      if (existing) {
        if (!existing.sources.includes(eventTag)) existing.sources.push(eventTag);
        if (!existing.name && r.name) existing.name = r.name;
        if (!existing.phone && r.phone) existing.phone = r.phone;
        if (new Date(r.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = r.createdAt;
        }
      } else {
        contactMap.set(email, {
          email,
          name: r.name || '',
          phone: r.phone || '',
          sources: [eventTag],
          primaryCategory: 'Event Attendee',
          tags: [r.department, r.year, r.institution].filter(Boolean),
          details: `${r.department || ''} (${r.year || ''}) - ${r.institution || ''}`,
          lastActive: r.createdAt,
        });
      }
    }

    // Add recruitment applicants
    for (const a of joinApps) {
      const email = (a.email || '').toLowerCase().trim();
      if (!email) continue;

      const roleTag = `Recruitment: ${a.department} (${a.roleApplied})`;
      const existing = contactMap.get(email);
      if (existing) {
        if (!existing.sources.includes(roleTag)) existing.sources.push(roleTag);
        if (!existing.name && a.name) existing.name = a.name;
        if (!existing.phone && a.phone) existing.phone = a.phone;
        if (new Date(a.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = a.createdAt;
        }
      } else {
        contactMap.set(email, {
          email,
          name: a.name || '',
          phone: a.phone || '',
          sources: [roleTag],
          primaryCategory: 'Recruitment Applicant',
          tags: [a.department, a.roleApplied, a.year].filter(Boolean),
          details: `Applied for ${a.roleApplied} in ${a.department}`,
          lastActive: a.createdAt,
        });
      }
    }

    // Add contact inquiries
    for (const inq of inquiries) {
      const email = (inq.email || '').toLowerCase().trim();
      if (!email) continue;

      const inqTag = `Inquiry: ${inq.category || 'General'}`;
      const existing = contactMap.get(email);
      if (existing) {
        if (!existing.sources.includes(inqTag)) existing.sources.push(inqTag);
        if (!existing.name && inq.name) existing.name = inq.name;
        if (!existing.phone && inq.phone) existing.phone = inq.phone;
        if (new Date(inq.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = inq.createdAt;
        }
      } else {
        contactMap.set(email, {
          email,
          name: inq.name || '',
          phone: inq.phone || '',
          sources: [inqTag],
          primaryCategory: 'General Inquiry',
          tags: [inq.category].filter(Boolean),
          details: inq.subject || 'Contact message',
          lastActive: inq.createdAt,
        });
      }
    }

    // Add newsletter subscribers
    for (const sub of subscribers) {
      const email = (sub.email || '').toLowerCase().trim();
      if (!email) continue;

      const subTag = 'Newsletter Subscriber';
      const existing = contactMap.get(email);
      if (existing) {
        if (!existing.sources.includes(subTag)) existing.sources.push(subTag);
      } else {
        contactMap.set(email, {
          email,
          name: '',
          phone: '',
          sources: [subTag],
          primaryCategory: 'Newsletter Subscriber',
          tags: ['Newsletter'],
          details: 'Direct email subscriber',
          lastActive: sub.subscribedAt || (sub as any).createdAt || new Date(),
        });
      }
    }

    let allContacts = Array.from(contactMap.values());

    // Filter by search query if present
    if (search) {
      allContacts = allContacts.filter(
        (c) =>
          c.email.toLowerCase().includes(search) ||
          c.name.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search) ||
          c.sources.some((s) => s.toLowerCase().includes(search)) ||
          c.details.toLowerCase().includes(search)
      );
    }

    // Filter by source
    if (sourceFilter !== 'All') {
      if (sourceFilter === 'Event') {
        allContacts = allContacts.filter((c) => c.sources.some((s) => s.startsWith('Event:')));
      } else if (sourceFilter === 'Join') {
        allContacts = allContacts.filter((c) => c.sources.some((s) => s.startsWith('Recruitment:')));
      } else if (sourceFilter === 'Newsletter') {
        allContacts = allContacts.filter((c) => c.sources.includes('Newsletter Subscriber'));
      } else if (sourceFilter === 'Contact') {
        allContacts = allContacts.filter((c) => c.sources.some((s) => s.startsWith('Inquiry:')));
      }
    }

    // Sort by last active descending
    allContacts.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

    // CSV Export
    if (format === 'csv') {
      const headers = ['Email', 'Full Name', 'Phone', 'Primary Category', 'Origin Sources', 'Details', 'Last Active'];
      const rows = allContacts.map((c) => [
        `"${c.email}"`,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${c.phone || ''}"`,
        `"${c.primaryCategory}"`,
        `"${c.sources.join(' | ').replace(/"/g, '""')}"`,
        `"${(c.details || '').replace(/"/g, '""')}"`,
        `"${new Date(c.lastActive).toISOString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="ecell-all-contacts-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUniqueEmails: contactMap.size,
        totalEventRegistrations: eventRegs.length,
        totalJoinApplications: joinApps.length,
        totalSubscribers: subscribers.length,
        totalInquiries: inquiries.length,
      },
      eventWiseBuckets,
      allContacts,
    });
  } catch (error: any) {
    console.error('All Emails Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve email contacts directory' },
      { status: 500 }
    );
  }
}
