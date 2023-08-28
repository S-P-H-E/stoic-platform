export default function Courses() {
    const iframeTitle = "AE - Episode 1"; 

    return (
        <div className='h-screen flex flex-col ml-[14rem]'>
            <div className="p-10 pt-8">
                <div className="p-[30%] rounded-lg relative flex flex-col items-start justify-start"> {/* video player */}
                    <iframe 
                        className="absolute w-full h-full top-0 left-0 ring-2 ring-white/10 rounded-lg" 
                        src="https://player.vimeo.com/video/858680259?h=1dcc942c0c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        title={iframeTitle}
                    >
                    </iframe>
                </div>
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold mt-4">{iframeTitle}</h1>
                <p className="font-light">RALLE IS GAY</p>
                </div>
            </div>
        </div>
    );
}
