import { NextRequest, NextResponse } from 'next/server';
import { generateOxAlphaCompletion } from '@/lib/ai';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`ai_gen_${ip}`, 20, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'AI request limit reached. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt, taskType, systemPrompt, metadata } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const defaultSystemPrompt =
      systemPrompt ||
      `You are the official Ox Alpha AI engine for E-Cell VITB (Entrepreneurship Cell of Vishnu Institute of Technology, Bhimavaram).
Motto: INNOVATE – CREATE – LEAD.
Deliver concise, highly actionable, professional, and authentic responses. Avoid robotic buzzwords or generic filler.`;

    const result = await generateOxAlphaCompletion({
      systemPrompt: defaultSystemPrompt,
      prompt: prompt.trim(),
      taskType: taskType || 'general',
      metadata,
    });

    return NextResponse.json({
      success: true,
      text: result.text,
      model: result.model,
      provider: result.provider,
      status: result.status,
    });
  } catch (error: any) {
    console.error('AI Generate Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI generation request' },
      { status: 500 }
    );
  }
}
