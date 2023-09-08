"use client"
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { UserDataFetcher } from '@/utils/userDataFetcher';

export default function CreateCourse(){
    const { userStatus } = UserDataFetcher();

    return(
        <div>
            {userStatus === 'admin' ? (
                <button className='flex justify-center items-center px-2 py-1 border border-[#3030307a] gap-1 rounded-xl cursor-pointer'>
                    <AiOutlineCloudUpload size={20}/>
                    Upload
                </button>

                
            ) : null}
        </div>
    )
}