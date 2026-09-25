import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getSessionFromRequest } from '@/lib/auth';
import { Event } from '@/models/Event';
import { EventRegistration } from '@/models/EventRegistration';
import { ContactInquiry } from '@/models/ContactInquiry';
import { JoinApplication } from '@/models/JoinApplication';
import { BlogPost } from '@/models/BlogPost';
import { NewsletterSubscriber } from '@/models/NewsletterSubscriber';
import { TeamMember } from '@/models/TeamMember';
import { Startup } from '@/models/Startup';
import { GalleryItem } from '@/models/GalleryItem';
import { Resource } from '@/models/Resource';
import { Partner } from '@/models/Partner';

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [
      totalEvents,
      totalRegistrations,
      pendingInquiries,
      totalInquiries,
      pendingApplications,
      totalApplications,
      totalSubscribers,
      totalBlogs,
      totalTeam,
      totalStartups,
      totalGallery,
      totalResources,
      totalPartners,
      recentRegistrations,
      recentInquiries,
    ] = await Promise.all([
      Event.countDocuments(),
      EventRegistration.countDocuments(),
      ContactInquiry.countDocuments({ status: 'new' }),
      ContactInquiry.countDocuments(),
      JoinApplication.countDocuments({ status: 'pending' }),
      JoinApplication.countDocuments(),
      NewsletterSubscriber.countDocuments({ status: 'active' }),
      BlogPost.countDocuments(),
      TeamMember.countDocuments(),
      Startup.countDocuments(),
      GalleryItem.countDocuments(),
      Resource.countDocuments(),
      Partner.countDocuments(),
      EventRegistration.find().sort({ createdAt: -1 }).limit(6).lean(),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      stats: {
        totalEvents,
        totalRegistrations,
        pendingInquiries,
        totalInquiries,
        pendingApplications,
        totalApplications,
        totalSubscribers,
        totalBlogs,
        totalTeam,
        totalStartups,
        totalGallery,
        totalResources,
        totalPartners,
      },
      recentRegistrations,
      recentInquiries,
    });
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
