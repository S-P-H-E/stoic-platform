import React, { useState, useEffect  } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BiSearch } from 'react-icons/bi'
import { BsStars } from 'react-icons/bs'
import { AiOutlineMenu } from "react-icons/ai";
import { YoutubeLogo, MusicNotes, Book, FileArrowDown, Gear } from "@phosphor-icons/react";
import Link from 'next/link';

import openai from '@/app/api/gpt';

export default function Search(){
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
  
    const handleInputChange = (e) => {
      setInput(e.target.value);
    };
  
    const handleSubmit = async () => {
      try {
        const newMessage = { role: 'user', content: input };
        const updatedConversation = [...conversation, newMessage];
        setLoading(true); // Set loading to true when submitting
  
        const completion = await openai.chat.completions.create({
          messages: updatedConversation,
          model: 'gpt-3.5-turbo',
        });
  
        const modelResponse = completion.choices[0].message.content;
        setResponse(modelResponse);
        setConversation(updatedConversation); // Update the conversation history
        setLoading(false); // Set loading back to false when response is received
      } catch (error) {
        console.error('Error:', error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default behavior of the Enter key (submitting a form)
        handleSubmit(); // Call handleSubmit when Enter key is pressed
    }
    };

    return(
        <Dialog>
            <DialogTrigger>
                <AiOutlineMenu size={20} />
            </DialogTrigger>
            <DialogContent>
                <div>
                    <div className="flex justify-center items-center gap-2 text-[#444445] px-4 py-4 rounded-full w-full">
                        <BsStars size={20}/>
                        <input 
                            placeholder="Ask AI..." 
                            className="bg-transparent placeholder:text-[#444445] w-full outline-none text-white"
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleInputKeyPress}
                            />
                    </div>
                    <div className="h-[1px] bg-[#272727] my-1"/>
                        {/* ChatGPT response */}
                        {loading ? (
                            <>
                                <div className="text-[#444445] px-5 pt-4 animate-bounce">...</div>
                                <div className="h-[1px] bg-[#272727] mt-5"/>
                            </>
                        ) : (
                            response && (
                                <>
                                    <div className='px-5 pt-4'>
                                    <p>{response}</p>
                                    </div>
                                    <div className="h-[1px] bg-[#272727] mt-5"/>
                                </>
                            )
                        )}

                    <div className="flex flex-col items-start gap-1 p-5">
                        <h1 className="text-[#444445] cursor-default">Tools</h1>

                        <Link href={'https://stoic-mp4-converter.vercel.app/'} target='_blank' className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <YoutubeLogo size={22} color="#444445" weight="fill" />
                            Download MP4 video
                        </Link>
                        <Link href={'https://stoic-converter.vercel.app/'} target='_blank' className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <MusicNotes size={22} color="#444445" weight="fill" />
                            Download MP3 audio
                        </Link>
                    </div>

                    <div className="flex flex-col items-start gap-1 p-5">
                        <h1 className="text-[#444445] cursor-default">Resources</h1>

                        <Link href={'/library'} className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <FileArrowDown size={22} color="#444445" weight="fill" />
                            Library
                        </Link>
                    </div>

                    <div className="flex flex-col items-start gap-1 p-5">
                        <h1 className="text-[#444445] cursor-default">Profile</h1>

                        <Link href={'/settings'} className="flex justify-start items-center gap-2 transition-all duration-300 rounded-lg hover:bg-[#1B1B1D] w-full px-2 py-2">
                            <Gear size={22} color="#444445" weight="fill" />
                            Settings
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}