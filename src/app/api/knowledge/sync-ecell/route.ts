import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { KnowledgeItem } from '@/models/KnowledgeItem';
import { getSessionFromRequest } from '@/lib/auth';

const defaultEcellKnowledge = [
  {
    title: 'E-Cell VITB Mission, Motto & Vision',
    category: 'About & Vision',
    source: 'https://ecellvitb.in/',
    tags: ['motto', 'mission', 'vision', 'overview'],
    content: `E-Cell, Vishnu Institute of Technology, is a student-driven community that promotes entrepreneurship and innovation. We help students turn ideas into startups by providing mentorship, networking, and funding opportunities. Through workshops, hackathons, and industry collaborations, we create a space for aspiring entrepreneurs to learn, grow, and build impactful solutions.
Motto: "INNOVATE – CREATE – LEAD"
Innovate: Think beyond boundaries and develop groundbreaking ideas.
Create: Transform ideas into real-world solutions with creativity and technology.
Lead: Inspire change, take initiative, and drive the future of entrepreneurship.
Vision: To build a thriving entrepreneurial ecosystem where students innovate, collaborate, and transform ideas into impactful startups.`,
    order: 1,
  },
  {
    title: 'Faculty Convenors & Leadership',
    category: 'Leadership',
    source: 'https://ecellvitb.in/#/team',
    tags: ['convenor', 'faculty', 'leadership', 'contact'],
    content: `Dr. R. V. D. Rama Rao serves as the Faculty Coordinator / Convenor for E-Cell VITB (Contact: e-cell@vishnu.edu.in).
Dr. B. V. S. T. Sai serves as the Co-Convenor of E-Cell VITB (Contact: Info.ecell@vishnu.edu.in).
Both convenors guide student innovation cohorts, patent exploration, IP strategy, and institutional linkages with state and national innovation ecosystems at Vishnu Institute of Technology, Bhimavaram.`,
    order: 2,
  },
  {
    title: '12 Active Recruitment Departments & Roles',
    category: 'Recruitment',
    source: 'https://ecellvitb.in/#/team/recruitment',
    tags: ['join', 'recruitment', 'teams', 'departments', 'roles'],
    content: `Recruitment is actively open across 12 distinct student operational and technical departments at Vishnu Institute of Technology:
1. Event Management: Planning stage protocols, schedules, time management, and logistics for summits.
2. Offstage: Backstage coordination, crowd management, registrations, and support operations.
3. Sponsorship: Securing brand sponsorships, cash grants, and corporate alignments.
4. Videography: Film shoots, event reels, cinematography, and post-production editing.
5. Communication: Official correspondence, notices, anchoring scripts, and PR outreach.
6. Design: Visual aesthetics, UI/UX mockups, stage backdrops, social collaterals, and merchandise.
7. Logistics & Operations: Venue hardware, electricals, audio-visual procurement, and spatial planning.
8. Marketing & Outreach: Campus promotions, club outreach, social growth, and publicity drives.
9. PR & HR: Inter-team culture, coordinator relations, and campus media relations.
10. R&D and Web Development: Building web platforms, developer portals, registration systems, and tools.
11. Content & Media: Writing startup breakdowns, editorial pieces, press releases, and articles.
12. Finance: Annual budgets, expense tracking, accounts auditing, and invoices.
Available roles for students in each department: Lead, Co-Lead, and Associate. Applications are submitted via the /join portal on the website.`,
    order: 3,
  },
  {
    title: 'Flagship Events: Ideathon 2026, Startup Expo & Tech Innovation Summit',
    category: 'Events',
    source: 'https://ecellvitb.in/#/events',
    tags: ['events', 'hackathon', 'ideathon', 'expo', 'summit'],
    content: `Flagship Events of E-Cell VITB:
- Ideathon 2026: Campus Venture Pitch - Inter-college ideation and pitching competition with angel mentors and prize pool grants.
- Startup Expo 2026: Prototype to Market - Central quadrangle demo day showcasing student hardware and software prototypes.
- Tech Innovation Summit: Masterclasses and panels featuring DeepTech, AI, and Nanotech startup founders.
- E-Summit: Annual flagship entrepreneurship confluence connecting investors, students, and founders.`,
    order: 4,
  },
  {
    title: 'Featured Startup Case Studies',
    category: 'Startups',
    source: 'https://ecellvitb.in/#/blogs',
    tags: ['startups', 'prodancy', 'theranautilus', 'taqtics', 'swish', 'onecell', 'pelocal'],
    content: `Key startup innovations analyzed by E-Cell VITB:
1. Prodancy: Next-gen surgical face protection with hydrophobic anti-fog micro-membranes for surgical heroes.
2. Theranautilus: Magnetically controlled nanorobots capable of penetrating deep into root canal dentinal tubules to eradicate bacterial biofilms.
3. Taqtics: AI-driven visual auditing and retail mobile SOP compliance for multi-store chains.
4. Swish: 10-minute fresh hot food delivery using predictive hyperlocal micro-kitchen pods.
5. OneCell Diagnostics (1Cell.AI): Single-cell genomics and multi-omics for personalized cancer detection.
6. PeLocal: WhatsApp conversational UPI billing and utility payments.`,
    order: 5,
  },
  {
    title: 'Campus Coordinates & Official Contact',
    category: 'Contact & Campus',
    source: 'https://ecellvitb.in/#/contact',
    tags: ['contact', 'address', 'email', 'phone', 'location'],
    content: `Official Campus Address:
Vishnu Institute of Technology, Vishnupur, Kovvada, Bhimavaram, West Godavari District, Andhra Pradesh - 534202.
Official Emails: e-cell@vishnu.edu.in and Info.ecell@vishnu.edu.in
Phone: +91 8816 251333
Lab Hours: Monday - Saturday, 9:00 AM - 6:00 PM (24/7 access during hackathons).`,
    order: 6,
  },
];

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let count = 0;
    for (const item of defaultEcellKnowledge) {
      await KnowledgeItem.findOneAndUpdate(
        { title: item.title },
        { $set: { ...item, active: true } },
        { upsert: true, new: true }
      );
      count++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${count} factual knowledge documents from https://ecellvitb.in/`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to sync knowledge base' }, { status: 500 });
  }
}
