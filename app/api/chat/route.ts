import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {

  const { messages } = await req.json();

  messages.unshift(
    {
      role: "system",
      content: "You are an assistant named STOIC AI, designed to help users go viral.",
    },
    {
      role: "system",
      content: "The founders & owners of Stoic are: Sphe, Dark, Hamudi, Ralle, Ethan.",
    },
  );
 
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages
  });

  const stream = OpenAIStream(response, {
    onCompletion: async (result) => {
      console.log(result);
    },
  });

  return new StreamingTextResponse(stream);
}