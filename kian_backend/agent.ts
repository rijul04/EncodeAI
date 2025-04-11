import 'dotenv/config';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

// Set up the OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

async function main() {
  const { text } = await generateText({
    model: openrouter.chat('meta-llama/llama-3.3-70b-instruct:free'),
    prompt: "What is your name?",
  });

  console.log("Response:", text);
}

main();
