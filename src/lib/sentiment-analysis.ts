interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    // Simple sentiment analysis based on positive and negative word lists
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'outstanding', 'brilliant', 'perfect', 'best', 'helpful', 'clear',
      'understand', 'learn', 'improve', 'enjoy', 'love', 'like'
    ];
    
    const negativeWords = [
      'bad', 'poor', 'terrible', 'awful', 'horrible', 'worst',
      'difficult', 'confusing', 'boring', 'hard', 'disappointing',
      'frustrating', 'hate', 'dislike', 'waste', 'wrong', 'problem'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    if (total === 0) {
      return { sentiment: 'neutral', score: 0 };
    }

    const score = (positiveCount - negativeCount) / total;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (score > 0.2) {
      sentiment = 'positive';
    } else if (score < -0.2) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }

    return {
      sentiment,
      score: Number(score.toFixed(2))
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return { sentiment: 'neutral', score: 0 };
  }
} 