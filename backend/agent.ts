/**
 * Basic example demonstrating a simple chat interface using Dreams
 * with a command line interface and Groq's LLM.
 */
import { createGroq } from "@ai-sdk/groq";
import { createDreams } from "@daydreamsai/core";
import { cliExtension } from "@daydreamsai/cli";

// Initialize Groq client
const groq = createGroq({
  apiKey: "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",
});

const agent = createDreams({
  model: groq("llama3-70b-8192"),
  extensions: [cliExtension],
}).start();
