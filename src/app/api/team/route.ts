import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { TeamMember } from '@/models/TeamMember';
import { getSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const query: any = {};
    const session = getSessionFromRequest(req);
    if (!session) {
      query.active = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const members = await TeamMember.find(query).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.role || !body.category) {
      return NextResponse.json({ error: 'Name, role, and category are required' }, { status: 400 });
    }

    await connectToDatabase();
    const slug = slugify(body.name + '-' + Math.floor(Math.random() * 1000));

    const member = await TeamMember.create({
      ...body,
      slug,
      photo: body.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    });

    await AuditLog.create({
      userId: session.userId,
      userEmail: session.email,
      action: 'CREATE_TEAM_MEMBER',
      entity: 'TeamMember',
      entityId: member._id.toString(),
      details: `Added team member: ${member.name} (${member.role})`,
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add team member' }, { status: 500 });
  }
}
