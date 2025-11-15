import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface AITaskResult {
  content: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export async function executeAITask(
  taskType: string,
  taskDescription: string,
  agentContext?: {
    name: string;
    type: string;
    description: string;
  }
): Promise<AITaskResult> {
  // Build system prompt based on task type and agent context
  let systemPrompt = `You are an AI assistant helping with automated tasks.`;
  
  if (agentContext) {
    systemPrompt += `\n\nYou are working as part of "${agentContext.name}", a ${agentContext.type} agent. Agent description: ${agentContext.description}`;
  }

  let userPrompt = taskDescription;

  // Customize prompts based on task type
  switch (taskType) {
    case 'text_generation':
      systemPrompt += `\n\nYour task is to generate high-quality text based on the user's request. Be creative, accurate, and helpful.`;
      break;
    case 'analysis':
      systemPrompt += `\n\nYour task is to analyze the provided information and provide clear, actionable insights.`;
      break;
    case 'summarization':
      systemPrompt += `\n\nYour task is to create a concise, accurate summary of the provided content.`;
      break;
    case 'question_answer':
      systemPrompt += `\n\nYour task is to answer questions accurately and helpfully based on the information provided.`;
      break;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || 'No response generated';
    const usage = completion.usage;

    return {
      content,
      model: completion.model,
      tokens: {
        prompt: usage?.prompt_tokens || 0,
        completion: usage?.completion_tokens || 0,
        total: usage?.total_tokens || 0,
      }
    };
  } catch (error) {
    console.error('AI task execution error:', error);
    throw new Error(`AI execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
