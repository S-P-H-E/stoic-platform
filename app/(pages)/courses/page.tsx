import { FiDownload } from 'react-icons/fi'

export default function Courses() {
    const iframeTitle = "AE - Episode 1"; 

    return (
        <div className='h-screen flex flex-col ml-[14rem]'>
            <div className="p-14 pt-8">{/* video container */}
                <div className="group w-[80%] pb-[45.1%] rounded-lg relative flex flex-col items-start justify-start"> {/* video player */}
                    <iframe 
                        className="absolute w-full h-full top-0 left-0 ring-2 ring-white/10 group-hover:ring-white/20 group-hover:ring-offset-2 ring-offset-white/20 group-hover:shadow-lg transition duration-300 rounded-lg" 
                        src="https://player.vimeo.com/video/858680259?h=1dcc942c0c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        title={iframeTitle}
                    >
                    </iframe>
                </div>
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold mt-6">{iframeTitle}</h1>
                <p className="font-light">The After Effects UI</p>


                <div className="flex flex-col gap-2">
                <h1 className="text-xl mt-8">Resources</h1>
                    <div className="max-w-[80%] max-h-[20rem] gap-2 flex"> {/* resources section */}
                        <div className="bg-white/5 rounded-lg p-2 flex gap-3">
                        <div className="bg-white/5 rounded-lg h-32 w-32 items-center justify-center flex group hover:cursor-pointer">
                                    <h1 className="group-hover:hidden">Test</h1>
                                    <div className='hidden group-hover:flex w-full h-full text-center items-center justify-center transition-all hover:bg-white/5 rounded-lg'>
                                        <FiDownload size={32} className="w-6 h-6  text-center items-center justify-center text-white" />
                                    </div>
                        </div>
                        </div>
                    </div>
                </div>
                </div>


                
            </div>
        </div>
    );
}
