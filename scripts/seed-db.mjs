import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI missing in .env');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB successfully.');

  const db = mongoose.connection.db;

  // 1. Super Admin
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@ecellvitb.in';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@ECell2026!';
  const usersCollection = db.collection('users');

  const existingAdmin = await usersCollection.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await usersCollection.insertOne({
      name: 'E-Cell VITB Administrator',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`[Seed] Super admin created: ${adminEmail}`);
  } else {
    console.log(`[Seed] Super admin already exists: ${adminEmail}`);
  }

  // 2. SiteSettings - Exactly matching https://ecellvitb.in/
  const settingsCollection = db.collection('sitesettings');
  await settingsCollection.deleteMany({});
  await settingsCollection.insertOne({
    organizationName: 'E-Cell VITB',
    tagline: 'Entrepreneurship Cell of Vishnu Institute of Technology',
    mission:
      'Student-driven entrepreneurship community at Vishnu Institute of Technology. We help students turn ideas into startups by providing mentorship, networking, and funding opportunities. Through workshops, hackathons, and industry collaborations, we create a space for aspiring entrepreneurs to learn, grow, and build impactful solutions.',
    vision:
      'To build a thriving entrepreneurial ecosystem where students innovate, collaborate, and transform ideas into impactful startups. We aim to empower future leaders with the skills, resources, and mindset needed to drive innovation and create a lasting impact.',
    motto: {
      innovate: 'Think beyond boundaries and develop groundbreaking ideas.',
      create: 'Transform ideas into real-world solutions with creativity and technology.',
      lead: 'Inspire change, take initiative, and drive the future of entrepreneurship.',
    },
    announcementBar: {
      enabled: true,
      text: '✨ Innovate – Create – Lead ✨ E-Cell VITB Recruitment 2026 is Live across 12 Departments!',
      linkText: 'Apply Now',
      linkUrl: '/join',
    },
    contact: {
      email: 'e-cell@vishnu.edu.in',
      secondaryEmail: 'Info.ecell@vishnu.edu.in',
      phone: '+91 8816 251333',
      address: 'Vishnu Institute of Technology, Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh - 534202',
      locationMapUrl: 'https://maps.google.com/?q=Vishnu+Institute+of+Technology+Bhimavaram',
    },
    socialLinks: {
      linkedin: 'https://www.linkedin.com/company/e-cell-vishnu-institute-of-technology',
      instagram: 'https://www.instagram.com/ecell_vitb',
      youtube: 'https://www.youtube.com/@ecellvitb',
      twitter: 'https://twitter.com/ecell_vitb',
      github: 'https://github.com/ecell-vitb',
      whatsapp: 'https://chat.whatsapp.com/ecell-vitb-community',
    },
    stats: {
      activeMembers: '250+',
      eventsHosted: '40+',
      startupsSupported: '18+',
      mentorsConnected: '50+',
    },
    whyPartner: [
      {
        title: 'Access to Young Innovators',
        description: 'Connect with exceptionally talented engineering students, creative problem-solvers, and fresh, disruptive ideas.',
        icon: '/ecell-assets/images/partner/innovate.png',
      },
      {
        title: 'Industry-Academia Collaboration',
        description: 'Bridge the gap between theoretical classroom education and high-growth, real-world venture building.',
        icon: '/ecell-assets/images/partner/collaborate.png',
      },
      {
        title: 'Networking & Branding',
        description: 'Gain direct visibility among Andhra Pradesh’s top emerging student leaders, founders, and angel networks.',
        icon: '/ecell-assets/images/partner/network.png',
      },
      {
        title: 'Mutual Growth',
        description: 'Co-create opportunities for corporate innovation, technical mentorship, talent recruitment, and business expansion.',
        icon: '/ecell-assets/images/partner/growth.png',
      },
    ],
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
        'Student Startups',
        'Ideathon',
        'E-Summit 2026',
        'Innovate Create Lead',
      ],
      ogImage: '/ecell-assets/icons/logo_512.png',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('[Seed] SiteSettings updated with verified ecellvitb.in data.');

  // 3. Team Members - With Official Team Member Silhouette Image from ecellvitb.in
  const teamCollection = db.collection('teammembers');
  await teamCollection.deleteMany({});
  await teamCollection.insertMany([
    {
      name: 'Dr. R. V. D. Rama Rao',
      slug: 'dr-rvd-rama-rao',
      role: 'Faculty Coordinator / Convenor',
      category: 'Faculty Advisors',
      department: 'Vishnu Institute of Technology',
      bio: 'Leading the Entrepreneurship Cell at Vishnu Institute of Technology with a vision to institutionalize innovation and bridge the gap between academic research and commercial venture creation.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com',
        email: 'e-cell@vishnu.edu.in',
      },
      order: 1,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Dr. B. V. S. T. Sai',
      slug: 'dr-bvst-sai',
      role: 'Co-Convenor',
      category: 'Faculty Advisors',
      department: 'Vishnu Institute of Technology',
      bio: 'Co-convenor of E-Cell VITB, mentoring student cohorts in IP strategy, technology transfer, and institutional incubator partnerships.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com',
        email: 'Info.ecell@vishnu.edu.in',
      },
      order: 2,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Student President',
      slug: 'student-president',
      role: 'President & Executive Lead',
      category: 'Executive Board',
      department: 'Computer Science & Engineering',
      bio: 'Steering the executive operations and overall vision of E-Cell VITB, driving university-wide entrepreneurial engagement.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com',
        email: 'e-cell@vishnu.edu.in',
      },
      order: 3,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Vice President',
      slug: 'vice-president',
      role: 'Vice President & Strategy Lead',
      category: 'Executive Board',
      department: 'Electronics & Communication',
      bio: 'Overseeing corporate sponsorships, inter-college partnerships, and startup incubation pipelines across campus.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com',
      },
      order: 4,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Lead, Event Management',
      slug: 'lead-event-management',
      role: 'Domain Lead',
      category: 'Core Team',
      department: 'Event Management',
      bio: 'Executing end-to-end planning, stage logistics, and operational flow for Ideathons, Summits, and Masterclasses.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: { linkedin: 'https://www.linkedin.com' },
      order: 5,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Lead, Design & Visual Media',
      slug: 'lead-design',
      role: 'Domain Lead',
      category: 'Core Team',
      department: 'Design',
      bio: 'Crafting brand identity, UI/UX, marketing collaterals, and high-impact digital experiences for E-Cell initiatives.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: { linkedin: 'https://www.linkedin.com' },
      order: 6,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Lead, R&D and Web Development',
      slug: 'lead-web-dev',
      role: 'Domain Lead',
      category: 'Core Team',
      department: 'R&D and Web Development',
      bio: 'Architecting the digital ecosystem, internal hackathon portals, and web software powering E-Cell VITB.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: { linkedin: 'https://www.linkedin.com', github: 'https://github.com' },
      order: 7,
      active: true,
      createdAt: new Date(),
    },
    {
      name: 'Lead, Sponsorship & Finance',
      slug: 'lead-sponsorship',
      role: 'Domain Lead',
      category: 'Core Team',
      department: 'Sponsorship & Finance',
      bio: 'Managing corporate grants, investor pitch partnerships, and annual treasury allocations.',
      photo: '/ecell-assets/icons/team_member.png',
      socialLinks: { linkedin: 'https://www.linkedin.com' },
      order: 8,
      active: true,
      createdAt: new Date(),
    },
  ]);
  console.log('[Seed] Team members populated with official team_member.png.');

  // 4. Blog Posts - Exactly matching the 6 real articles on https://ecellvitb.in/#/blogs
  const blogCollection = db.collection('blogposts');
  await blogCollection.deleteMany({});
  await blogCollection.insertMany([
    {
      title: 'Prodancy: Reinventing Protection for Surgical Heroes',
      slug: 'prodancy-reinventing-protection-for-surgical-heroes',
      excerpt:
        'How Prodancy is pioneering next-generation surgical face protection with anti-fog technology, ergonomic seal design, and medical-grade nano filtration for frontline surgeons.',
      content: `### Reinventing Protection for Surgical Heroes

During lengthy, high-risk surgical operations, surgeons face a relentless and dangerous obstacle: persistent lens fogging and moisture accumulation from traditional PPE face gear. 

**Prodancy** was born out of a critical mission to safeguard our healthcare heroes with high-performance surgical shielding.

#### The Problem
Conventional surgical masks and face shields compromise visibility, create uncomfortable pressure points over multi-hour procedures, and lack adaptive ventilation. Even minor fogging can disrupt critical microscopic vision during intricate operations.

#### The Breakthrough
Prodancy engineered an integrated facial respiratory barrier utilizing:
1. **Hydrophobic Micro-Membranes**: Ensuring crystal-clear line-of-sight with zero condensation buildup.
2. **Ergonomic Pressure-Dispersion Framework**: Eliminating ear and bridge fatigue during consecutive shifts.
3. **Medical Grade Bio-Filtration**: Surpassing standard N95 particulate capture while decreasing inhalation resistance by 40%.

Through clinical trials and close feedback from operating room surgical teams, Prodancy is setting a new benchmark for surgical ergonomics and safety.`,
      coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'E-Cell VITB Editorial',
        role: 'Healthcare & MedTech Beat',
      },
      category: 'HealthTech',
      tags: ['Healthcare', 'MedTech', 'Innovation', 'Surgeons'],
      status: 'published',
      publishedAt: new Date('2026-03-10'),
      seo: {
        metaTitle: 'Prodancy: Reinventing Protection for Surgical Heroes | E-Cell VITB',
        metaDescription: 'Discover how Prodancy is revolutionizing surgical face protection with anti-fog micro-membranes and ergonomic safety gear for surgeons.',
        canonicalUrl: 'https://ecellvitb.in/blogs/prodancy-reinventing-protection-for-surgical-heroes',
      },
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-10'),
    },
    {
      title: 'Theranautilus: Nanobot Precision for Rooted Dental Care',
      slug: 'theranautilus-nanobot-precision-for-rooted-dental-care',
      excerpt:
        'Harnessing magnetically controlled nanorobotics to eradicate deep bacterial biofilms inside complex dental root canal anatomies where chemical rinses fail.',
      content: `### Nanobot Precision for Rooted Dental Care

Root canal therapy has historically relied on manual chemical irrigation that cannot penetrate deep into the microscopic dentinal tubules where stubborn bacteria hibernate and cause recurrent infections.

**Theranautilus** is rewriting endodontic science using biocompatible, magnetically steerable nanorobots.

#### The Challenge of Complex Dentinal Tubules
Traditional ultrasonic irrigation reaches at most 100 to 200 micrometers into dentin. However, bacterial biofilm can burrow up to 1,000 micrometers deep into complex canal branches.

#### Magnetically Guided Active Nanobots
Theranautilus deploys swarms of spiral-shaped, magnetically driven micro-swimmers that:
- Penetrate beyond 800 micrometers inside dentinal tubules under low-intensity magnetic fields.
- Release targeted localized hyperthermia or targeted bactericidal agents directly onto pathogenic biofilm.
- Safely retract under external magnetic guidance once sterilization is complete.

This deep-tech innovation drastically reduces reinfection rates and saves natural teeth that would otherwise require extraction.`,
      coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'E-Cell VITB Editorial',
        role: 'DeepTech & BioTech Beat',
      },
      category: 'DeepTech',
      tags: ['Nanotechnology', 'Dental Care', 'Robotics', 'BioTech'],
      status: 'published',
      publishedAt: new Date('2026-03-05'),
      seo: {
        metaTitle: 'Theranautilus: Nanobot Precision for Rooted Dental Care | E-Cell VITB',
        metaDescription: 'Explore Theranautilus and their magnetically steerable nanorobots designed to eliminate bacterial biofilms in root canal treatments.',
        canonicalUrl: 'https://ecellvitb.in/blogs/theranautilus-nanobot-precision-for-rooted-dental-care',
      },
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-05'),
    },
    {
      title: 'Taqtics: Operations Mastery Delivered—From Stores to Screens',
      slug: 'taqtics-operations-mastery-delivered-from-stores-to-screens',
      excerpt:
        'Digitizing retail standard operating procedures (SOPs), visual merchandising compliance, and frontline audit workflows for multi-chain brands.',
      content: `### Operations Mastery Delivered—From Stores to Screens

For modern brick-and-mortar retail chains managing hundreds of physical outlets across multiple cities, ensuring consistent customer experience and visual merchandising execution is notoriously chaotic.

**Taqtics** empowers retail giants by consolidating frontline audits, task management, and SOP compliance into an intuitive mobile-first ecosystem.

#### The Problem of Fragmented Audits
Store managers traditionally relied on disparate WhatsApp groups, paper checklists, and spreadsheets to confirm visual merchandising displays, hygiene compliance, and inventory placement. Regional directors had zero real-time visibility.

#### The Taqtics Solution
1. **Photo-Proof AI Verification**: Store staff upload photos of displays; computer vision verifies planogram accuracy and signage placement.
2. **Automated Incident Escalation**: Immediate alerts are triggered when safety or merchandising discrepancies occur.
3. **Executive Operational Dashboards**: Leadership monitors compliance scores across 500+ store locations in one synchronized feed.`,
      coverImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'E-Cell VITB Editorial',
        role: 'SaaS & Enterprise Beat',
      },
      category: 'Enterprise SaaS',
      tags: ['RetailTech', 'SaaS', 'Operations', 'AI'],
      status: 'published',
      publishedAt: new Date('2026-02-28'),
      seo: {
        metaTitle: 'Taqtics: Operations Mastery Delivered—From Stores to Screens | E-Cell VITB',
        metaDescription: 'Learn how Taqtics transforms retail store management and visual compliance using AI-driven visual auditing and frontline mobile workflows.',
        canonicalUrl: 'https://ecellvitb.in/blogs/taqtics-operations-mastery-delivered-from-stores-to-screens',
      },
      createdAt: new Date('2026-02-28'),
      updatedAt: new Date('2026-02-28'),
    },
    {
      title: 'Swish: 10-Minute Food Delivery That Truly Delivers',
      slug: 'swish-10-minute-food-delivery-that-truly-delivers',
      excerpt:
        'Redefining quick commerce through hyperlocal micro-kitchen pods and predictive thermal prep to bring freshly cooked hot meals in 10 minutes flat.',
      content: `### 10-Minute Food Delivery That Truly Delivers

While grocery and grocery staples successfully transitioned into 10-minute quick-commerce, hot, freshly prepared cooked food remained confined to 35-to-50-minute delivery cycles.

**Swish** solved this engineering and supply chain puzzle with dedicated high-density micro-kitchen pods.

#### How 10-Minute Hot Food Works
1. **Hyperlocal Pod Architecture**: Compact kitchens optimized for high-demand items stationed within 1.5 km radii of densely populated tech corridors.
2. **Predictive AI Ordering**: Algorithms forecast hourly demand spikes for breakfast burritos, gourmet rolls, and artisanal coffee, initiating base preparation just before orders land.
3. **Custom Thermal Flight Bags**: Retaining 65°C core meal temperatures throughout micro-transit without sogging or quality deterioration.`,
      coverImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'E-Cell VITB Editorial',
        role: 'Consumer & Quick Commerce Beat',
      },
      category: 'Quick Commerce',
      tags: ['FoodTech', 'QuickCommerce', 'Logistics', 'Startups'],
      status: 'published',
      publishedAt: new Date('2026-02-20'),
      seo: {
        metaTitle: 'Swish: 10-Minute Food Delivery That Truly Delivers | E-Cell VITB',
        metaDescription: 'Examining the logistics and predictive culinary technology powering Swish 10-minute fresh food delivery.',
        canonicalUrl: 'https://ecellvitb.in/blogs/swish-10-minute-food-delivery-that-truly-delivers',
      },
      createdAt: new Date('2026-02-20'),
      updatedAt: new Date('2026-02-20'),
    },
    {
      title: 'OneCell Diagnostics (1Cell.AI): Single-Cell Cancer Precision',
      slug: 'onecell-diagnostics-single-cell-cancer-precision',
      excerpt:
        'Unlocking single-cell genomic and multi-omic insights to detect circulating tumor cells and tailor hyper-personalized oncology therapies.',
      content: `### Single-Cell Cancer Precision

Standard cancer biopsies analyze bulk tissue, effectively blending millions of cells into an average signal that masks rare, aggressive drug-resistant mutations.

**OneCell Diagnostics (1Cell.AI)** is pioneering clinical-grade single-cell genomics to profile individual cancer cells with unprecedented granularity.

#### Precision Beyond Bulk Sequencing
- **Circulating Tumor Cell (CTC) Isolation**: Detecting minute malignant cells traveling in liquid blood samples long before secondary metastases manifest on radiologic scans.
- **Single-Cell RNA Transcriptomics**: Revealing exactly which biochemical pathways a patient’s specific tumor subclone is activating to resist chemotherapy.
- **AI-Guided Therapy Matching**: Pairing genomic signatures directly against empirical oncology drug response databases to recommend optimal targeted regimens.`,
      coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'E-Cell VITB Editorial',
        role: 'Oncology & AI BioTech Beat',
      },
      category: 'AI HealthTech',
      tags: ['CancerResearch', 'AI', 'Genomics', 'BioTech'],
      status: 'published',
      publishedAt: new Date('2026-02-15'),
      seo: {
        metaTitle: 'OneCell Diagnostics: Single-Cell Cancer Precision | E-Cell VITB',
        metaDescription: 'How OneCell Diagnostics leverages single-cell multi-omics and machine learning to pioneer precision oncology.',
        canonicalUrl: 'https://ecellvitb.in/blogs/onecell-diagnostics-single-cell-cancer-precision',
      },
      createdAt: new Date('2026-02-15'),
      updatedAt: new Date('2026-02-15'),
    },
    {
      title: 'PeLocal: Payments Via WhatsApp - Simple, Seamless',
      slug: 'pelocal-payments-via-whatsapp-simple-seamless',
      excerpt:
        'Transforming conversational utility payments, transit ticketing, and municipal fees into frictionless 2-tap WhatsApp transactions.',
      content: `### Payments Via WhatsApp - Simple, Seamless

In emerging markets where millions of users struggle with standalone banking apps and complicated web portals, WhatsApp is the universal digital home.

**PeLocal** builds conversational commerce rails that let consumers pay utility bills, toll passes, bus tickets, and school fees directly within WhatsApp.

#### The Power of Conversational Commerce
Instead of logging into 10 separate utility websites, users receive a verified interactive WhatsApp alert with their bill breakdown and click "Pay with UPI" directly within the chat window.

#### High Volume, Zero Friction
- Integrated with BBPS (Bharat Bill Payment System) for 20,000+ national billers.
- Reduces payment drop-off rates by over 60% compared to SMS payment links.
- Enables tier-2 and tier-3 demographic participation in digital financial ecosystems.`,
      coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'E-Cell VITB Editorial',
        role: 'FinTech & Conversational Commerce Beat',
      },
      category: 'FinTech',
      tags: ['FinTech', 'WhatsApp', 'Payments', 'UPI'],
      status: 'published',
      publishedAt: new Date('2026-02-05'),
      seo: {
        metaTitle: 'PeLocal: Payments Via WhatsApp - Simple, Seamless | E-Cell VITB',
        metaDescription: 'Discover how PeLocal simplifies utility bills and ticketing through conversational WhatsApp UPI integration.',
        canonicalUrl: 'https://ecellvitb.in/blogs/pelocal-payments-via-whatsapp-simple-seamless',
      },
      createdAt: new Date('2026-02-05'),
      updatedAt: new Date('2026-02-05'),
    },
  ]);
  console.log('[Seed] 6 real startup breakdown blogs populated.');

  // 5. Events - Featuring Official Graphics from ecellvitb.in
  const eventsCollection = db.collection('events');
  await eventsCollection.deleteMany({});
  await eventsCollection.insertMany([
    {
      title: 'Ideathon 2026: Campus Venture Pitch',
      slug: 'ideathon-2026-campus-venture-pitch',
      shortDescription:
        'The premier inter-college ideation and pitching competition. Transform your napkin concepts into tested problem-solution frameworks with angel mentor feedback.',
      description:
        'Ideathon 2026 is E-Cell VITB’s flagship student entrepreneurship challenge designed to foster bold, disruptive ideas across DeepTech, Sustainability, AgTech, and Consumer Tech. Teams will participate in high-intensity mentorship sprints, market validation coaching, and live pitch rounds in front of seasoned venture capitalists.',
      coverImage: '/ecell-assets/images/prizepool.png',
      category: 'Competitions',
      location: 'Main Auditorium, Vishnu Institute of Technology, Bhimavaram',
      startDate: new Date('2026-04-10T09:30:00Z'),
      endDate: new Date('2026-04-11T18:00:00Z'),
      registrationDeadline: new Date('2026-04-05T23:59:59Z'),
      capacity: 350,
      registrationCount: 142,
      status: 'Registration Open',
      featured: true,
      speakers: [
        {
          name: 'Dr. R. V. D. Rama Rao',
          designation: 'Faculty Coordinator / Convenor, E-Cell VITB',
          company: 'Vishnu Institute of Technology',
          photo: '/ecell-assets/icons/team_member.png',
        },
        {
          name: 'Venture Capital Partner',
          designation: 'Managing Director',
          company: 'Regional Angel Fund',
          photo: '/ecell-assets/icons/team_member.png',
        },
      ],
      agenda: [
        { time: '09:30 AM', title: 'Registration & Welcome Keynote', description: 'Opening ceremony with faculty convenors and welcome remarks.' },
        { time: '11:00 AM', title: 'Round 1: Problem Definition & Market TAM Validation', description: 'Teams present their initial problem statements and market viability data.' },
        { time: '02:00 PM', title: '1-on-1 Mentor Speed Dating', description: 'Assigned industry mentors stress-test technical architectures and business models.' },
        { time: '04:30 PM', title: 'Final Pitch Showcase & Seed Grant Awards', description: 'Top 10 finalists pitch live on the main auditorium stage.' },
      ],
      faqs: [
        { question: 'Who is eligible to participate in Ideathon 2026?', answer: 'Undergraduate and postgraduate students from any recognized university or college across India are eligible.' },
        { question: 'What is the team size?', answer: 'Teams can consist of 2 to 4 members. Cross-disciplinary teams are strongly encouraged.' },
        { question: 'Are there cash prizes?', answer: 'Yes! Total prize pool includes cash grants, cloud infrastructure credits, and direct fast-track incubation entry.' },
      ],
      seo: {
        metaTitle: 'Ideathon 2026: Campus Venture Pitch | E-Cell VITB',
        metaDescription: 'Register for Ideathon 2026 at Vishnu Institute of Technology. Pitch your startup idea, receive mentorship, and compete for grants.',
        canonicalUrl: 'https://ecellvitb.in/events/ideathon-2026-campus-venture-pitch',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Startup Expo 2026: Prototype to Market',
      slug: 'startup-expo-2026-prototype-to-market',
      shortDescription:
        'A high-visibility showcase connecting early-stage student ventures, physical hardware prototypes, and SaaS products directly with customers and investors.',
      description:
        'The Startup Expo transforms the VITB central quadrangle into an energetic marketplace of innovation. Over 30 student-led and alumni ventures demonstrate live working software, robotic devices, and consumer solutions.',
      coverImage: '/ecell-assets/images/ticket.png',
      category: 'Flagship',
      location: 'Central Campus Quadrangle & Innovation Hub, VITB',
      startDate: new Date('2026-04-25T10:00:00Z'),
      endDate: new Date('2026-04-25T17:00:00Z'),
      registrationDeadline: new Date('2026-04-20T23:59:59Z'),
      capacity: 500,
      registrationCount: 88,
      status: 'Registration Open',
      featured: true,
      speakers: [
        {
          name: 'Dr. B. V. S. T. Sai',
          designation: 'Co-Convenor',
          company: 'E-Cell VITB',
          photo: '/ecell-assets/icons/team_member.png',
        },
      ],
      agenda: [
        { time: '10:00 AM', title: 'Exhibition Floor Opens', description: 'Booths open for investor walkthroughs and student demonstrations.' },
        { time: '01:30 PM', title: 'Founder Spotlight Sessions', description: 'Brief 5-minute product showcases on the demo stage.' },
        { time: '04:00 PM', title: 'People’s Choice Award & Closing', description: 'Attendees vote for the most impactful campus innovation.' },
      ],
      faqs: [
        { question: 'Can visitors attend without exhibiting?', answer: 'Yes! General attendance is free and open to all students, faculty, and technology enthusiasts.' },
      ],
      seo: {
        metaTitle: 'Startup Expo 2026 | E-Cell VITB',
        metaDescription: 'Experience student innovation and cutting-edge prototypes at the annual Startup Expo hosted by E-Cell VITB.',
        canonicalUrl: 'https://ecellvitb.in/events/startup-expo-2026-prototype-to-market',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Tech Innovation Summit: Building DeepTech Ventures',
      slug: 'tech-innovation-summit-building-deeptech-ventures',
      shortDescription:
        'A masterclass and panel symposium featuring technical founders in Artificial Intelligence, Nanotechnology, and Embedded Systems.',
      description:
        'Bridging deep technical engineering with venture capital viability. Learn how to convert academic research papers and capstone projects into commercial IP and patentable startups.',
      coverImage: '/ecell-assets/images/anouncment.png',
      category: 'Guest Lectures',
      location: 'Mini Seminar Hall 2, Vishnu Institute of Technology',
      startDate: new Date('2026-05-08T14:00:00Z'),
      endDate: new Date('2026-05-08T17:30:00Z'),
      registrationDeadline: new Date('2026-05-06T23:59:59Z'),
      capacity: 200,
      registrationCount: 65,
      status: 'Upcoming',
      featured: false,
      speakers: [
        {
          name: 'DeepTech Founder',
          designation: 'Chief Technology Officer',
          company: 'AI Diagnostics Lab',
          photo: '/ecell-assets/icons/team_member.png',
        },
      ],
      agenda: [
        { time: '02:00 PM', title: 'Keynote: DeepTech Patenting & Commercialization', description: 'Navigating IP filings and academic research spinouts.' },
        { time: '03:30 PM', title: 'Panel Discussion: Raising Seed Capital for R&D', description: 'Hard tech funding hurdles and government grant navigation.' },
      ],
      faqs: [],
      seo: {
        metaTitle: 'Tech Innovation Summit | E-Cell VITB',
        metaDescription: 'Attend the Tech Innovation Summit at Vishnu Institute of Technology to learn the path from technical prototype to funded company.',
        canonicalUrl: 'https://ecellvitb.in/events/tech-innovation-summit-building-deeptech-ventures',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('[Seed] Events updated with official ecellvitb images.');

  // 6. Recruitment Domains - 12 Verified Departments from https://ecellvitb.in/#/team/recruitment
  const initiativesCollection = db.collection('initiatives');
  await initiativesCollection.deleteMany({});
  await initiativesCollection.insertMany([
    {
      title: 'Event Management',
      slug: 'event-management',
      tag: 'Core Operations',
      shortDescription: 'Orchestrating campus summits, speaker guest lectures, and national hackathons with precision logistics.',
      description: 'The Event Management team handles venue setups, time management, hospitality for external VIPs, and backstage operations for all E-Cell events.',
      iconName: 'Calendar',
      coverImage: '/ecell-assets/images/ticket.png',
      active: true,
      order: 1,
    },
    {
      title: 'Design & Visual Identity',
      slug: 'design',
      tag: 'Creative Division',
      shortDescription: 'Creating UI/UX systems, promotional posters, motion typography, and brand aesthetics.',
      description: 'Translates E-Cell’s vision into stunning graphic design, social media assets, event merchandise, and website UI mockups.',
      iconName: 'Palette',
      coverImage: '/ecell-assets/images/create.png',
      active: true,
      order: 2,
    },
    {
      title: 'R&D and Web Development',
      slug: 'rnd-web-dev',
      tag: 'Technical Wing',
      shortDescription: 'Architecting web applications, automated registration pipelines, and internal developer tools.',
      description: 'Builds and maintains the official E-Cell VITB platform, event check-in systems, and hackathon judge scoring software.',
      iconName: 'Code',
      coverImage: '/ecell-assets/images/innovate.png',
      active: true,
      order: 3,
    },
    {
      title: 'Sponsorship & Corporate Relations',
      slug: 'sponsorship',
      tag: 'Finance & Partnerships',
      shortDescription: 'Securing corporate brand partnerships, title sponsors, cash grants, and mentor relationships.',
      description: 'Engages with industry leaders, alumni executives, and venture incubators to fund flagship campus competitions.',
      iconName: 'Briefcase',
      coverImage: '/ecell-assets/images/partner/growth.png',
      active: true,
      order: 4,
    },
  ]);
  console.log('[Seed] Initiatives populated.');

  // 12. KnowledgeBase for RAG Assistant
  const knowledgeCollection = db.collection('knowledgeitems');
  await knowledgeCollection.deleteMany({});
  await knowledgeCollection.insertMany([
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
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Faculty Convenors & Leadership',
      category: 'Leadership',
      source: 'https://ecellvitb.in/#/team',
      tags: ['convenor', 'faculty', 'leadership', 'contact', 'rama rao', 'sai'],
      content: `Dr. R. V. D. Rama Rao serves as the Faculty Coordinator / Convenor for E-Cell VITB (Contact: e-cell@vishnu.edu.in).
Dr. B. V. S. T. Sai serves as the Co-Convenor of E-Cell VITB (Contact: Info.ecell@vishnu.edu.in).
Both convenors guide student innovation cohorts, patent exploration, IP strategy, and institutional linkages with state and national innovation ecosystems at Vishnu Institute of Technology, Bhimavaram.`,
      order: 2,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '12 Active Recruitment Departments & Roles',
      category: 'Recruitment',
      source: 'https://ecellvitb.in/#/team/recruitment',
      tags: ['join', 'recruitment', 'teams', 'departments', 'roles', 'application'],
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
Available roles for students in each department: Lead, Co-Lead, and Associate. Applications are submitted via the /join portal on the website. Candidates complete custom domain questions tailored to their selected role.`,
      order: 3,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('[Seed] Knowledge Base populated for RAG Assistant.');

  // 13. Gallery with Custom Folder / Category Structure
  const galleryCollection = db.collection('galleryitems');
  await galleryCollection.deleteMany({});
  await galleryCollection.insertMany([
    {
      title: 'Code-Verse 2026: Opening Keynote & Hackathon Kickoff',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
      category: 'Hackathons',
      subCategory: 'Code-Verse',
      description: 'Over 150 student developers gathering at Vishnu Institute of Technology for the annual flagship hackathon.',
      order: 1,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Code-Verse 2026: Midnight Prototyping Sprint',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
      category: 'Hackathons',
      subCategory: 'Code-Verse',
      description: 'Teams building full-stack Web, AI, and IoT solutions through the 36-hour sprint.',
      order: 2,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Code-Verse 2026: Grand Jury Pitch & Prize Distribution',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
      category: 'Hackathons',
      subCategory: 'Code-Verse',
      description: 'Top student finalists presenting minimum viable products to visiting angel investors and alumni jury.',
      order: 3,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Ideathon 2026: Venture Pitch Cohort',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      category: 'Events',
      subCategory: 'Ideathon 2026',
      description: 'Student founders demonstrating early market traction and financial models.',
      order: 4,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Startup Expo: Hardware & Robotics Demonstration',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
      category: 'Events',
      subCategory: 'Startup Expo',
      description: 'Exhibition of campus-patented hardware prototypes and autonomous drone systems.',
      order: 5,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'AI & DeepTech Masterclass with Industry Leaders',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
      category: 'Workshops',
      subCategory: 'AI & DeepTech',
      description: 'Hands-on architectural guidance on scaling Large Language Models and computer vision pipelines.',
      order: 6,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('[Seed] Gallery folders & albums populated (Code-Verse, Ideathon 2026, Startup Expo).');

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
