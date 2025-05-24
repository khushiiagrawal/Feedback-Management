import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export type SentimentResult = {
  positive: number;
  neutral: number;
  negative: number;
};

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const result = await hf.textClassification({
      model: 'finiteautomata/bertweet-base-sentiment-analysis',
      inputs: text,
    });

    // Convert the result to our format
    const sentiment = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    result.forEach((item: any) => {
      const score = item.score;
      switch (item.label.toLowerCase()) {
        case 'positive':
          sentiment.positive = score;
          break;
        case 'neutral':
          sentiment.neutral = score;
          break;
        case 'negative':
          sentiment.negative = score;
          break;
      }
    });

    return sentiment;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
} 