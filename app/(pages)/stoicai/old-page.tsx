"use client"
import { IoSend } from 'react-icons/io5'
import openai from '@/app/api/GPT';
import { useState } from 'react';

type Message = {
    role: "function" | "user" | "system" | "assistant";
    content: string;
};

export default function StoicAi() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
  
    async function sendMessage(input: string, conversation: Message[]) {
      try {
        // Prepare the message with the user's input
        const newMessage = {
          role: 'user' as const,
          content: input,
        };
  
        // Include the new message in the conversation history
        const updatedConversation = [...conversation, newMessage];
  
        // Make the request to GPT-3
        const completion = await openai.chat.completions.create({
          messages: updatedConversation, // This includes all conversation, with the new message
          model: 'gpt-3.5-turbo',
        });
  
        // Extract GPT-3's response
        const modelResponse = completion.choices[0].message.content;
  
        // Update your state with the response
        if (modelResponse) {
          setResponse(modelResponse);
          setConversation(updatedConversation);
          setInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error sending message to GPT-3:', error);
      }
    }
  
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="bg-[#222224] px-4 py-2 rounded-full flex items-center">
          <input
            placeholder="Ask Stoic AI"
            className="bg-transparent outline-none placeholder:text-[#97A1AA] w-[500px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div
            className="bg-white text-black w-fit p-3 rounded-full cursor-pointer"
            onClick={() => sendMessage(input, conversation)} // Call the sendMessage function on click
          >
            <IoSend />
          </div>
        </div>
  
        <div className="mt-4 text-white text-left">
          {/* Display the conversation */}
          {conversation.map((message, index) => (
            <div key={index} className={`text-${message.role} text-red-500`}>
              {message.content}
            </div>
          ))}
  
          {/* Display GPT-3's response */}
          {response && <div className="text-assistant">{response}</div>}
        </div>
      </div>
    );
  }