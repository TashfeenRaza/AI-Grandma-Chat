import OpenAI from 'openai';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class OpenAIService {
  private openai: OpenAI;
  private culture: string;
  private culturalPhrases: Record<string, string[]>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Default culture is American, can be configured via environment variable
    this.culture = process.env.GRANDMA_CULTURE || 'American';

    // Cultural phrases for different grandma types
    this.culturalPhrases = {
      'American': [
        'Oh my goodness', 'Bless your heart', 
        'Back in my day', 'Well I never', 
        'Land sakes', 'Heavens to Betsy', 
        'You\'re growing like a weed'
      ],
      'Italian': [
        'Madonna mia', 'Mangia, mangia', 
        'Che bello', 'Mamma mia', 
        'Dio mio', 'Tesoro mio', 
        'Hai mangiato?'
      ],
      'Jewish': [
        'Oy vey', 'Bubbeleh', 
        'Mazel tov', 'Such a mensch', 
        'Gevalt', 'You should eat something', 
        'Enough already'
      ],
      'Southern': [
        'Bless your heart', 'Y\'all come back now', 
        'Fixin\' to', 'Well I declare', 
        'Heavens to Betsy', 'Sweet as pie', 
        'Aren\'t you precious'
      ],
      // Add more cultures as needed
    };
  }

  /**
   * Generates a grandma-style response to the user's question
   * @param question The user's question
   * @returns A grandma-style response
   */
  public async generateGrandmaResponse(question: string): Promise<string> {
    try {
      logger.info(`Generating grandma response for: "${question}"`);

      // Get the relevant cultural phrases
      const phrases = this.culturalPhrases[this.culture] || this.culturalPhrases['American'];
      const phrasesStr = phrases.join(', ');

      // Create the prompt
      const prompt = `Act as a ${this.culture} grandma. Respond to: "${question}". 
Use phrases like "${phrasesStr}". Keep the response warm, slightly scolding, 
and under 20 words. Make it sound authentic to a ${this.culture} grandmother.`;

      // Call the OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a loving grandmother who gives short, warm responses.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60,
        temperature: 0.7,
      });

      // Extract the response text
      const responseText = response.choices[0]?.message?.content?.trim() || 'Oh sweetie, I can\'t understand you. Could you speak up?';
      
      logger.info(`Generated response: "${responseText}"`);
      return responseText;
    } catch (error) {
      logger.error(`OpenAI API error: ${(error as Error).message}`);
      throw new Error(`OpenAI Error: ${(error as Error).message}`);
    }
  }
} 