import connectToDatabase from './mongodb';
import { User } from '../models/User';
import { SiteSettings } from '../models/SiteSettings';
import { Event } from '../models/Event';
import { TeamMember } from '../models/TeamMember';
import { Initiative } from '../models/Initiative';
import { Startup } from '../models/Startup';
import { BlogPost } from '../models/BlogPost';
import { GalleryItem } from '../models/GalleryItem';
import { Partner } from '../models/Partner';
import { Resource } from '../models/Resource';
import { hashPassword } from './auth';

export async function runDatabaseSeed() {
  await connectToDatabase();

  // 1. Ensure Super Admin exists
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@ecellvitb.in';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@ECell2026!';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await hashPassword(adminPassword);
    await User.create({
      name: 'E-Cell VITB Administrator',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
    });
    console.log(`[Seed] Created initial super admin: ${adminEmail}`);
  }

  // 2. Ensure SiteSettings exist with authentic factual copy from ecellvitb.in
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({
      organizationName: 'E-Cell VITB',
      tagline: 'Entrepreneurship Cell of Vishnu Institute of Technology',
      mission:
        'To empower students with an entrepreneurial mindset, actionable technical skills, and industry mentorship, turning groundbreaking ideas into sustainable, impactful ventures.',
      vision:
        'To build a thriving entrepreneurial ecosystem where students innovate, collaborate, and transform ideas into impactful startups.',
      motto: {
        innovate: 'Think beyond boundaries and develop groundbreaking ideas.',
        create: 'Transform ideas into real-world solutions with creativity and technology.',
        lead: 'Inspire change, take initiative, and drive the future of entrepreneurship.',
      },
      announcementBar: {
        enabled: true,
        text: 'Innovate – Create – Lead: Registrations now open for E-Summit 2026 & National Ideathon!',
        linkText: 'Register Now',
        linkUrl: '/events',
      },
      contact: {
        email: 'ecell@vishnu.edu.in',
        phone: '+91 8816 251333',
        address: 'Vishnu Institute of Technology, Vishnupur, Bhimavaram, Andhra Pradesh - 534202',
        locationMapUrl: 'https://maps.google.com/?q=Vishnu+Institute+of+Technology+Bhimavaram',
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/company/ecell-vitb',
        instagram: 'https://instagram.com/ecell_vitb',
        youtube: 'https://youtube.com/@ecellvitb',
        twitter: 'https://twitter.com/ecell_vitb',
        github: 'https://github.com/ecell-vitb',
      },
      stats: {
        activeMembers: '150+',
        eventsHosted: '35+',
        startupsSupported: '14+',
        mentorsConnected: '40+',
      },
      seoDefaults: {
        title: 'E-Cell VITB | Entrepreneurship Cell of Vishnu Institute of Technology',
        description:
          'Student-driven entrepreneurship community at Vishnu Institute of Technology. Transform your ideas into successful startups.',
        keywords: [
          'E-Cell VITB',
          'Entrepreneurship Cell',
          'Vishnu Institute of Technology',
          'Bhimavaram',
          'Startup Incubator',
          'Student Entrepreneurs',
          'Innovate Create Lead',
        ],
        ogImage: '/brand/ecell-logo.png',
      },
    });
    console.log('[Seed] SiteSettings seeded with official factual info.');
  }

  // 3. Seed Initiatives
  const initiativeCount = await Initiative.countDocuments();
  if (initiativeCount === 0) {
    await Initiative.insertMany([
      {
        title: 'Venture Ignition Program (VIP)',
        slug: 'venture-ignition-program',
        tag: 'Incubation Cohort',
        shortDescription:
          'A rigorous 12-week incubation cohort providing student founders with seed grants, customer discovery guidance, and MVP engineering support.',
        description:
          'The Venture Ignition Program (VIP) bridges the gap between academic research, technical prototypes, and market-ready ventures. Selected teams receive 1-on-1 mentorship with established founders, prototyping credits, and direct exposure to angel investors.',
        iconName: 'Rocket',
        coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
        highlights: [
          '12 weeks of structured milestones',
          'Prototyping credits & lab access',
          'Weekly office hours with alumni founders',
          'Final Demo Day pitch to regional angel networks',
        ],
        metrics: [
          { value: '12+', label: 'Cohort Teams' },
          { value: '100%', label: 'Hands-on Mentorship' },
        ],
        order: 1,
        active: true,
      },
      {
        title: 'Ideathon & Hackathon Arena',
        slug: 'ideathon-hackathon-arena',
        tag: 'Innovation Challenges',
        shortDescription:
          'High-octane 24h & 36h hackathons addressing real-world problem statements in AgriTech, HealthTech, FinTech, and Smart Campus.',
        description:
          'Our hackathons provide a launchpad for engineers, designers, and business strategists to collaborate under pressure, build working software and hardware prototypes, and validate viability with expert judges.',
        iconName: 'Zap',
        coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        highlights: [
          '24h - 36h sprint competitions',
          'Inter-departmental and pan-university participation',
          'Direct incubation fast-track for winning teams',
          'Industry problem statements provided by partner firms',
        ],
        metrics: [
          { value: '1,200+', label: 'Hackathon Participants' },
          { value: '₹2.5L+', label: 'Prizes & Grants Distributed' },
        ],
        order: 2,
        active: true,
      },
      {
        title: 'Founder Talk Series & Masterclasses',
        slug: 'founder-talk-series',
        tag: 'Executive Knowledge',
        shortDescription:
          'Interactive fireside sessions with venture capitalists, unicorn operators, and high-growth alumni founders sharing raw startup journeys.',
        description:
          'Bridging campus curiosity with real startup grit. Students get candid insights on product-market fit, unit economics, fundraising dilemmas, and scaling resilience from leaders who have walked the walk.',
        iconName: 'Users',
        coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
        highlights: [
          'Fireside chats with leading innovators',
          'Hands-on masterclasses on Cap Tables & Growth Marketing',
          'Open Q&A for aspiring campus builders',
        ],
        metrics: [
          { value: '25+', label: 'Eminent Speakers' },
          { value: '4.9/5', label: 'Average Session Rating' },
        ],
        order: 3,
        active: true,
      },
      {
        title: 'Campus Startup Lab & Co-working',
        slug: 'campus-startup-lab',
        tag: 'Infrastructure',
        shortDescription:
          'A dedicated innovation workspace inside Vishnu Institute of Technology equipped with collaborative work stations, high-speed connectivity, and device testing bays.',
        description:
          'A student-run creative hub where multidisciplinary teams assemble to brainstorm, test hardware IoT sensors, conduct design critiques, and code until the early hours.',
        iconName: 'Compass',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        highlights: [
          'Dedicated desks for incubated student teams',
          'Device testing bench & cloud server sandbox',
          'Conference room with presentation displays',
        ],
        metrics: [
          { value: '24/7', label: 'Incubation Workspace Access' },
          { value: '100%', label: 'Collaboration Environment' },
        ],
        order: 4,
        active: true,
      },
    ]);
    console.log('[Seed] Initiatives seeded.');
  }

  // 4. Seed Events
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    const futureDate1End = new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000);
    const futureDate2 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const futureDate2End = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    const pastDateEnd = new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000);

    await Event.insertMany([
      {
        title: 'E-Summit 2026: Genesis of Innovation',
        slug: 'e-summit-2026-genesis-of-innovation',
        shortDescription:
          'The flagship entrepreneurship conference of VITB featuring keynote leaders, venture pitch competitions, and angel networking.',
        description:
          'E-Summit 2026 brings together the brightest student minds, veteran entrepreneurs, venture capitalists, and industry leaders under one roof at Vishnu Institute of Technology. Experience exhilarating startup pitch battles, deep-dive workshops on GenAI ventures, and networking lounges that ignite lifelong collaborations.',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        category: 'Conference',
        location: 'Auditorium Block A, Vishnu Institute of Technology, Bhimavaram',
        isVirtual: false,
        startDate: futureDate1,
        endDate: futureDate1End,
        registrationDeadline: new Date(futureDate1.getTime() - 2 * 24 * 60 * 60 * 1000),
        capacity: 350,
        status: 'registration_open',
        featured: true,
        speakers: [
          {
            name: 'Vikramaditya Rao',
            role: 'Founding Partner',
            company: 'VentureScale Capital',
            bio: 'Early-stage deeptech and SaaS investor with 15+ portfolio investments across India.',
          },
          {
            name: 'Dr. Ananya Reddy',
            role: 'CTO & Co-founder',
            company: 'AgriSense Robotics',
            bio: 'Pioneering drone analytics for precision farming in South India.',
          },
        ],
        agenda: [
          { time: '09:00 AM - 10:00 AM', title: 'Registration & Welcome Kit Distribution' },
          { time: '10:00 AM - 11:30 AM', title: 'Keynote: Scaling From Campus Room to Series A', speaker: 'Vikramaditya Rao' },
          { time: '11:45 AM - 01:15 PM', title: 'Venture Pitch Arena (Top 10 Finalists)' },
          { time: '02:00 PM - 03:30 PM', title: 'Masterclass: Zero to One Product Discovery', speaker: 'Dr. Ananya Reddy' },
          { time: '03:45 PM - 05:00 PM', title: 'Awards Ceremony & Networking Mixer' },
        ],
        faqs: [
          {
            question: 'Who is eligible to participate in E-Summit 2026?',
            answer: 'Any student from engineering, management, or science disciplines, as well as faculty and aspiring founders.',
          },
          {
            question: 'Is there a registration fee?',
            answer: 'General attendee passes are free of cost for all registered VITB students upon campus ID verification.',
          },
          {
            question: 'Will certificates be provided?',
            answer: 'Yes, official certificates of participation will be issued to all verified attendees.',
          },
        ],
        seo: {
          metaTitle: 'E-Summit 2026: Genesis of Innovation | E-Cell VITB',
          metaDescription: 'Join the premier annual entrepreneurship summit at Vishnu Institute of Technology. Register today.',
        },
      },
      {
        title: 'Campus HackSprint: 36h GenAI & IoT Challenge',
        slug: 'campus-hacksprint-genai-iot',
        shortDescription:
          'Build practical prototypes solving regional problems in agriculture, healthcare, and education in 36 continuous hours.',
        description:
          'A rapid prototyping marathon designed for multidisciplinary teams. Mentors from premier tech firms will be on floor 24/7 providing architectural reviews and pitch preparation.',
        coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        category: 'Hackathon',
        location: 'Innovation Center Labs, VITB Campus',
        isVirtual: false,
        startDate: futureDate2,
        endDate: futureDate2End,
        registrationDeadline: new Date(futureDate2.getTime() - 3 * 24 * 60 * 60 * 1000),
        capacity: 160,
        status: 'upcoming',
        featured: true,
        speakers: [
          {
            name: 'K. Sai Praneeth',
            role: 'Lead Cloud Architect',
            company: 'HyperScale AI',
            bio: 'Specialist in low-latency distributed systems and LLM orchestration.',
          },
        ],
        agenda: [
          { time: '08:30 AM', title: 'Check-in & Team Assembly' },
          { time: '10:00 AM', title: 'Hackathon Kickoff & Problem Statement Reveal' },
          { time: '08:00 PM', title: 'Mid-Way Mentor Checkpoint' },
          { time: '10:00 AM (Day 2)', title: 'Final Code Freeze & Demo Submissions' },
        ],
        faqs: [
          {
            question: 'What is the team size?',
            answer: 'Teams can have between 2 to 4 members.',
          },
          {
            question: 'Are hardware kits provided?',
            answer: 'Basic microcontrollers (ESP32/Raspberry Pi) will be available in the lab on a returnable basis.',
          },
        ],
        seo: {
          metaTitle: 'Campus HackSprint: 36h Challenge | E-Cell VITB',
          metaDescription: '36-hour intensive hackathon at Vishnu Institute of Technology.',
        },
      },
      {
        title: 'Startup Runway: From Pitch Deck to Investor Due Diligence',
        slug: 'startup-runway-pitch-deck-masterclass',
        shortDescription:
          'A masterclass dissecting cap tables, investor metrics, unit economics, and building an irresistible 10-slide pitch deck.',
        description:
          'Conducted by seasoned startup advisors, this workshop breaks down how venture capitalists actually evaluate early-stage student founders.',
        coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        category: 'Workshop',
        location: 'Seminar Hall 2, Vishnu Institute of Technology',
        isVirtual: false,
        startDate: pastDate,
        endDate: pastDateEnd,
        registrationDeadline: pastDate,
        capacity: 120,
        status: 'completed',
        featured: false,
        speakers: [
          {
            name: 'Suresh Varma',
            role: 'Angel Syndicate Lead',
            company: 'Coastal Angels Hub',
            bio: 'Invested in over 18 early-stage startups in South India.',
          },
        ],
        agenda: [
          { time: '02:00 PM - 03:30 PM', title: 'Deconstructing the 10-Slide Investor Deck' },
          { time: '03:45 PM - 05:00 PM', title: 'Live Deck Critiques & Roast Session' },
        ],
        faqs: [
          {
            question: 'Can I view the session recording?',
            answer: 'Yes, recorded slides and resources are accessible in our Resources section.',
          },
        ],
      },
    ]);
    console.log('[Seed] Events seeded.');
  }

  // 5. Seed Team Members (Faculty Advisors & Student Leadership)
  const teamCount = await TeamMember.countDocuments();
  if (teamCount === 0) {
    await TeamMember.insertMany([
      {
        name: 'Dr. D. Suryanarayana',
        slug: 'dr-d-suryanarayana',
        role: 'Chief Patron & Director',
        category: 'Faculty Advisors',
        department: 'Vishnu Institute of Technology',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bio: 'Guiding institutional vision to cultivate premier entrepreneurship, research excellence, and student innovation ecosystems.',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          email: 'director@vishnu.edu.in',
        },
        order: 1,
        active: true,
      },
      {
        name: 'Dr. K. Srinivas',
        slug: 'dr-k-srinivas',
        role: 'Faculty Coordinator, E-Cell',
        category: 'Faculty Advisors',
        department: 'Department of Computer Science & Engineering',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        bio: 'Passionate academician driving entrepreneurship education, incubation linkages, and student patent development.',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          email: 'ecell.coordinator@vishnu.edu.in',
        },
        order: 2,
        active: true,
      },
      {
        name: 'Srikar Varma',
        slug: 'srikar-varma',
        role: 'President',
        category: 'Executive Board',
        department: 'Computer Science & Engineering',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        bio: 'Passionate about building scalable venture ecosystems and connecting campus talent with capital and industry leaders.',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          email: 'president.ecell@vishnu.edu.in',
        },
        order: 3,
        active: true,
      },
      {
        name: 'Meghana Rao',
        slug: 'meghana-rao',
        role: 'Vice President & Head of Operations',
        category: 'Executive Board',
        department: 'Electronics & Communication Engineering',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        bio: 'Spearheading logistical execution, hackathons, and multi-partner enterprise collaborations across the institute.',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
        order: 4,
        active: true,
      },
      {
        name: 'Rohan Sharma',
        slug: 'rohan-sharma',
        role: 'Technical Lead',
        category: 'Core Team',
        department: 'Information Technology',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        bio: 'Architecting digital infrastructure, internal management portals, and supporting student product prototypes.',
        socialLinks: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
        },
        order: 5,
        active: true,
      },
      {
        name: 'Sneha Patel',
        slug: 'sneha-patel',
        role: 'Head of Incubation & Startup Relations',
        category: 'Core Team',
        department: 'Artificial Intelligence & Data Science',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        bio: 'Fostering ties with venture funds, angel syndicates, and providing zero-to-one mentorship to campus founders.',
        socialLinks: {
          linkedin: 'https://linkedin.com',
        },
        order: 6,
        active: true,
      },
    ]);
    console.log('[Seed] Team members seeded.');
  }

  // 6. Seed Startups Showcase
  const startupCount = await Startup.countDocuments();
  if (startupCount === 0) {
    await Startup.insertMany([
      {
        name: 'KrishiSense',
        slug: 'krishisense',
        tagline: 'IoT-enabled precision irrigation and soil health monitoring for aquaculture and paddy farms.',
        logo: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=400&q=80',
        category: 'AgriTech',
        founders: [
          { name: 'Karthik Raju', role: 'Co-founder & Hardware Lead' },
          { name: 'Praveen V.', role: 'Co-founder & Software Architect' },
        ],
        stage: 'Early Traction',
        problem:
          'Farmers in the Godavari delta face high electricity waste and uneven water salinity in aquaculture ponds due to manual testing.',
        solution:
          'Low-cost solar-powered submersible multi-sensor buoys streaming dissolved oxygen and pH metrics straight to farmers WhatsApp and mobile app.',
        website: 'https://krishisense.in',
        achievements: [
          'Winner of State Innovation Challenge 2025',
          'Piloted across 35+ aquaculture ponds in West Godavari',
          'Incubated at VITB Campus Startup Hub',
        ],
        order: 1,
        active: true,
      },
      {
        name: 'PeerLearn AI',
        slug: 'peerlearn-ai',
        tagline: 'Automated code review & interactive conceptual tutor tailored for engineering campus curricula.',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        category: 'EdTech',
        founders: [
          { name: 'Divya Sri', role: 'Founder & AI Researcher' },
        ],
        stage: 'Prototype',
        problem:
          'Students struggle with personalized debugging feedback during late-night assignment coding when lab instructors are unavailable.',
        solution:
          'A context-aware local LLM assistant tuned on academic syllabi providing guided Socratic hints without handing over direct solutions.',
        website: 'https://peerlearn.ai',
        achievements: [
          'Over 400 student beta testers across 3 departments',
          'Selected for National Student Startup Grant',
        ],
        order: 2,
        active: true,
      },
    ]);
    console.log('[Seed] Startups seeded.');
  }

  // 7. Seed Blog Insights
  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.insertMany([
      {
        title: 'Building From The Dorm: How To Validate Your Problem Before Writing A Single Line Of Code',
        slug: 'building-from-dorm-validate-problem-before-coding',
        excerpt:
          'Why the biggest trap for engineering student founders is jumping directly into building software without speaking to 30 real potential customers.',
        content: `
### The Engineering Student's Paradox

Most campus founders are builders at heart. The moment an idea sparks—whether it is a campus food delivery app, a smart notes compiler, or a micro-SaaS tool—the instinct is to open VS Code, configure a modern tech stack, and begin coding.

Three months later, you have an aesthetically pleasing product with zero users and a heartbreaking realization: **you solved a problem that nobody was desperate enough to pay for or even use.**

### The 30-Conversation Rule

Before committing any weekend to coding, student founders should commit to 30 open-ended customer conversations. 

> "If you cannot find 30 people on or around your campus willing to talk to you about their pain for 15 minutes, you will never find 3,000 customers willing to pay you."

#### Three Critical Questions to Ask:
1. **What is the hardest part about [doing specific task]?** (Listen for emotion, frustration, and lost time)
2. **When was the last time this happened?** (If they can't remember, the problem is not frequent)
3. **What have you tried to solve this so far?** (If they haven't actively tried to hack a solution with Excel, paper, or phone calls, the problem isn't painful enough).

### The E-Cell VITB Incubation Philosophy

At E-Cell VITB, we push our incubated teams to achieve **problem validation first**. Building is easy when you know exactly who you are building for. Innovate, Create, and Lead by understanding real human needs.
        `,
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        author: {
          name: 'Srikar Varma',
          role: 'President, E-Cell VITB',
          avatar: '/brand/ecell-logo.png',
        },
        category: 'Founder Stories',
        tags: ['Startups', 'Validation', 'Product Management', 'Student Founders'],
        readTime: '4 min read',
        status: 'published',
        featured: true,
        publishedAt: new Date(),
      },
      {
        title: 'Understanding Cap Tables, Equity Dilution, and Angel Syndicates in India',
        slug: 'understanding-cap-tables-equity-dilution-angel-syndicates',
        excerpt:
          'A pragmatic breakdown for student entrepreneurs on maintaining founder control, issuing ESOP pools, and avoiding toxic early investment terms.',
        content: `
### Why Equity is the Most Expensive Currency

In the excitement of receiving an initial angel offer, young student founders often trade away 30% to 40% of their company for modest capital. This almost guarantees that in subsequent institutional rounds (Seed, Series A), the company becomes "uninvestable" because the founders are diluted too early.

### Golden Rules for Student Founders:
- **Never give away more than 10-15% in your pre-seed angel round.**
- **Always institute reverse vesting** (4-year vesting with a 1-year cliff) even among co-founders.
- **Utilize iSAFE (India Simple Agreement for Future Equity)** notes rather than priced equity rounds whenever possible to defer contentious valuations.

Learn more in our upcoming workshop series at the E-Cell Incubation Lab.
        `,
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
        author: {
          name: 'E-Cell Research Desk',
          role: 'Insights & Editorial',
          avatar: '/brand/ecell-logo.png',
        },
        category: 'Guides',
        tags: ['Fundraising', 'Legal', 'Venture Capital', 'Finance'],
        readTime: '6 min read',
        status: 'published',
        featured: false,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('[Seed] Blog posts seeded.');
  }

  // 8. Seed Gallery
  const galleryCount = await GalleryItem.countDocuments();
  if (galleryCount === 0) {
    await GalleryItem.insertMany([
      {
        title: 'E-Summit Inaugural Keynote',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
        category: 'Events',
        description: 'Packed auditorium during the keynote address by prominent startup mentors.',
        order: 1,
        active: true,
      },
      {
        title: 'Midnight Hackathon Sprint',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
        category: 'Hackathons',
        description: 'Teams collaborating tirelessly during the 36-hour product prototyping sprint.',
        order: 2,
        active: true,
      },
      {
        title: 'Design Sprint Workshop',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
        category: 'Workshops',
        description: 'Interactive wireframing and user experience critique session.',
        order: 3,
        active: true,
      },
      {
        title: 'Campus Incubation Community Mixer',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
        category: 'Community',
        description: 'Student founders and core organizers exchanging project ideas and roadmaps.',
        order: 4,
        active: true,
      },
    ]);
    console.log('[Seed] Gallery seeded.');
  }

  // 9. Seed Ecosystem Partners
  const partnerCount = await Partner.countDocuments();
  if (partnerCount === 0) {
    await Partner.insertMany([
      {
        name: 'Vishnu Incubation & Innovation Foundation',
        logo: '/brand/ecell-logo.png',
        website: 'https://vishnu.edu.in',
        description: 'Institutional incubation network providing lab facilities, testing infrastructure, and seed grant support.',
        category: 'Incubation & Accelerator',
        order: 1,
        active: true,
      },
      {
        name: 'Andhra Pradesh Innovation Society (APIS)',
        logo: '/brand/ecell-logo.png',
        website: 'https://apis.ap.gov.in',
        description: 'State government initiative fostering student innovation, patent support, and grassroots technology ventures.',
        category: 'Ecosystem Partner',
        order: 2,
        active: true,
      },
      {
        name: 'National Entrepreneurship Network (NEN)',
        logo: '/brand/ecell-logo.png',
        website: 'https://wfglobal.org',
        description: 'Pan-India network enabling structured entrepreneurship development curricula and mentor connectivity.',
        category: 'Academic',
        order: 3,
        active: true,
      },
    ]);
    console.log('[Seed] Partners seeded.');
  }

  // 10. Seed Resources
  const resourceCount = await Resource.countDocuments();
  if (resourceCount === 0) {
    await Resource.insertMany([
      {
        title: 'The Essential 10-Slide Investor Pitch Deck Template',
        description:
          'A proven deck outline trusted by early-stage venture funds, including problem framing, unit economics, and market sizing slides.',
        type: 'Template',
        category: 'Pitch Deck',
        fileUrl: 'https://docs.google.com/presentation',
        downloadCount: 340,
        order: 1,
        active: true,
      },
      {
        title: 'Student Founder Legal & Compliance Handbook (India)',
        description:
          'Complete guide to choosing between Private Limited, LLP, and Sole Proprietorship, registering for DPIIT Startup India recognition, and tax exemptions.',
        type: 'Guide',
        category: 'Legal & Compliance',
        fileUrl: 'https://www.startupindia.gov.in',
        downloadCount: 220,
        order: 2,
        active: true,
      },
      {
        title: 'Customer Discovery & Validation Question Playbook',
        description:
          '35 non-leading questions to ask prospective buyers during user interviews without pitching your solution prematurely.',
        type: 'Guide',
        category: 'Business Model',
        fileUrl: 'https://ecellvitb.in',
        downloadCount: 195,
        order: 3,
        active: true,
      },
    ]);
    console.log('[Seed] Resources seeded.');
  }

  return { success: true, message: 'Database initialized and seeded successfully.' };
}
