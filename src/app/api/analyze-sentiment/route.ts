import { NextResponse } from 'next/server';
import { analyzeSentiment } from '@/lib/sentiment';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const sentiment = await analyzeSentiment(text);
    return NextResponse.json(sentiment);
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
} 