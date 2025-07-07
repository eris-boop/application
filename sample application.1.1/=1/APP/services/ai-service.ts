interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  completion: string;
}

export class AIService {
  private static readonly API_URL = 'https://toolkit.rork.com/text/llm/';

  static async generateWorkoutSuggestion(userPreferences: {
    fitnessLevel: string;
    availableTime: number;
    goals: string;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a fitness expert. Provide a personalized workout suggestion based on user preferences. Keep it concise and actionable.',
      },
      {
        role: 'user',
        content: `Create a workout plan for someone with ${userPreferences.fitnessLevel} fitness level, ${userPreferences.availableTime} minutes available, and goals: ${userPreferences.goals}. Include specific exercises and duration.`,
      },
    ];

    return this.makeRequest(messages);
  }

  static async generateMealSuggestion(userPreferences: {
    calorieGoal: number;
    dietaryRestrictions: string;
    mealType: string;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a nutrition expert. Provide healthy meal suggestions based on user preferences. Include approximate calories and macros.',
      },
      {
        role: 'user',
        content: `Suggest a ${userPreferences.mealType} meal for someone with a ${userPreferences.calorieGoal} calorie daily goal. Dietary restrictions: ${userPreferences.dietaryRestrictions || 'none'}. Include ingredients and preparation tips.`,
      },
    ];

    return this.makeRequest(messages);
  }

  static async generateProductivityTips(userContext: {
    currentTasks: number;
    completedToday: number;
    timeOfDay: string;
  }): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a productivity coach. Provide personalized productivity tips and motivation based on user context.',
      },
      {
        role: 'user',
        content: `I have ${userContext.currentTasks} tasks remaining and completed ${userContext.completedToday} tasks today. It is currently ${userContext.timeOfDay}. Give me 3 specific productivity tips to help me stay focused and motivated.`,
      },
    ];

    return this.makeRequest(messages);
  }

  static async generateHabitSuggestions(userGoals: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a habit formation expert. Suggest 3-5 small, achievable daily habits that can help users reach their goals.',
      },
      {
        role: 'user',
        content: `Based on these goals: "${userGoals}", suggest specific daily habits that would help achieve them. Make them small and easy to start.`,
      },
    ];

    return this.makeRequest(messages);
  }

  private static async makeRequest(messages: AIMessage[]): Promise<string> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AIResponse = await response.json();
      return data.completion;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI suggestion. Please try again.');
    }
  }
}