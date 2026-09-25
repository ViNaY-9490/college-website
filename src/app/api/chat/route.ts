import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { KnowledgeItem } from '@/models/KnowledgeItem';
import { Startup } from '@/models/Startup';
import { Event } from '@/models/Event';
import { generateOxAlphaCompletion } from '@/lib/ai';

// Common English question stop words to filter out before keyword matching
const STOP_WORDS = new Set([
  'tell', 'about', 'what', 'is', 'are', 'who', 'the', 'how', 'do', 'can',
  'you', 'me', 'please', 'give', 'some', 'info', 'information', 'details',
  'i', 'want', 'to', 'know', 'of', 'in', 'at', 'for', 'with', 'a', 'an', 'and'
]);

function scoreDocument(
  doc: { title?: string; content?: string; tags?: string[] },
  keywords: string[]
): number {
  let score = 0;
  for (const kw of keywords) {
    // 1. Tag match (Highest priority)
    if (doc.tags && doc.tags.some((t) => t.toLowerCase() === kw)) {
      score += 30;
    }
    // 2. Title match (High priority)
    if (doc.title && doc.title.toLowerCase().includes(kw)) {
      score += 20;
    }
    // 3. Content occurrences
    if (doc.content) {
      try {
        const regex = new RegExp(`\\b${kw}`, 'gi');
        const matches = doc.content.match(regex);
        if (matches) score += Math.min(matches.length * 3, 15);
      } catch {
        if (doc.content.toLowerCase().includes(kw)) score += 5;
      }
    }
  }
  return score;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const query = message.trim();
    await connectToDatabase();

    // 1. Extract significant keywords
    const rawTokens = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const significantKeywords = rawTokens.filter((w) => !STOP_WORDS.has(w));
    const searchTerms = significantKeywords.length > 0 ? significantKeywords : rawTokens;

    // 2. Retrieve candidates from KnowledgeItem
    const regexPattern = searchTerms.map((t) => `(${t})`).join('|');
    let kiCandidates = await KnowledgeItem.find({
      active: true,
      $or: [
        { tags: { $in: searchTerms } },
        { title: { $regex: regexPattern, $options: 'i' } },
        { content: { $regex: regexPattern, $options: 'i' } },
      ],
    }).lean();

    // Fallback if no specific keyword match
    if (kiCandidates.length === 0) {
      kiCandidates = await KnowledgeItem.find({ active: true }).sort({ order: 1 }).limit(4).lean();
    }

    // 3. Also check Startup collection for direct matches (e.g., KrishiSense, PeerLearn AI)
    const startupCandidates = await Startup.find({
      active: true,
      $or: [
        { name: { $regex: regexPattern, $options: 'i' } },
        { category: { $regex: regexPattern, $options: 'i' } },
        { description: { $regex: regexPattern, $options: 'i' } },
      ],
    }).limit(2).lean();

    // 4. Also check Event collection for direct event queries
    const eventCandidates = await Event.find({
      $or: [
        { title: { $regex: regexPattern, $options: 'i' } },
        { category: { $regex: regexPattern, $options: 'i' } },
        { shortDescription: { $regex: regexPattern, $options: 'i' } },
      ],
    }).limit(2).lean();

    // Combine all retrieved candidates into uniform RAG items
    interface RAGDoc {
      title: string;
      content: string;
      source: string;
      tags: string[];
    }

    const allCandidateDocs: RAGDoc[] = [
      ...kiCandidates.map((k: any) => ({
        title: k.title,
        content: k.content,
        source: k.source || 'E-Cell Knowledge Base',
        tags: Array.isArray(k.tags) ? k.tags : [],
      })),
      ...startupCandidates.map((s: any) => ({
        title: `Campus Startup: ${s.name}`,
        content: `${s.name} is an active student venture born at Vishnu Institute of Technology.\nTagline: ${s.tagline || ''}\nCategory: ${s.category}\nFounder: ${s.founder || 'Student Innovators'}\nOverview: ${s.description}`,
        source: 'VITB Startup Showcase',
        tags: ['startup', s.name.toLowerCase(), s.category?.toLowerCase() || ''],
      })),
      ...eventCandidates.map((e: any) => ({
        title: `Campus Event: ${e.title}`,
        content: `${e.title} (${e.category})\nStatus: ${e.status}\nDate: ${new Date(e.startDate).toDateString()}\nLocation: ${e.location}\nSummary: ${e.shortDescription}\nDetails: ${e.description}\n${e.registrationLink ? `Outside Registration Link: ${e.registrationLink}` : 'Registration via Portal Form available.'}`,
        source: 'Campus Events Calendar',
        tags: ['event', e.category?.toLowerCase() || '', e.slug],
      })),
    ];

    // 5. Score & Rank all documents by relevance to the user's specific query
    const rankedDocs = allCandidateDocs
      .map((doc) => ({
        doc,
        score: scoreDocument(doc, searchTerms),
      }))
      .sort((a, b) => b.score - a.score)
      .map((r) => r.doc);

    // Keep top 4 most relevant chunks
    const topMatchingDocs = rankedDocs.slice(0, 4);

    // 6. Synthesize Grounded Context for Ox Alpha Prompt
    const contextText = topMatchingDocs
      .map((d) => `[Source: ${d.title} (${d.source})]:\n${d.content}`)
      .join('\n\n');

    const systemPrompt = `You are the official Ox Alpha AI Assistant for E-Cell VITB (Entrepreneurship Cell of Vishnu Institute of Technology, Bhimavaram, Andhra Pradesh).
Official Motto: INNOVATE – CREATE – LEAD.
Faculty Convenor: Dr. R. V. D. Rama Rao
Co-Convenor: Dr. B. V. S. T. Sai
Headquarters: Vishnu Institute of Technology, Vishnupur, Bhimavaram - 534202.
Official Emails: e-cell@vishnu.edu.in, Info.ecell@vishnu.edu.in

Your task: Provide accurate, direct, and authentic answers to questions based on the following verified campus knowledge:
${contextText}

Guidelines:
- Answer the user's specific question directly with relevant details.
- Avoid repeating generic greetings if answering a specific question.
- For events, mention that registration is available both via In-Portal Form and via outside link.
- For recruitment, link to /join.`;

    // 7. Generate Response via Ox Alpha (or resilient grounded RAG fallback)
    const aiResult = await generateOxAlphaCompletion({
      systemPrompt,
      prompt: query,
      taskType: 'chat',
      matchingDocs: topMatchingDocs,
      metadata: {
        sourcesCount: topMatchingDocs.length,
      },
    });

    return NextResponse.json({
      answer: aiResult.text,
      model: aiResult.model,
      provider: aiResult.provider,
      status: aiResult.status,
      sources: topMatchingDocs.map((d) => ({
        title: d.title,
        source: d.source,
      })),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while querying the knowledge base.' },
      { status: 500 }
    );
  }
}
